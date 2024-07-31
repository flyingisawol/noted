import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NDK, { NDKEvent, NDKFilter, NDKNip07Signer, NDKUserProfile } from '@nostr-dev-kit/ndk'
import { insertEventIntoDescendingList } from '../utils/helperFunctions'

import { Metadata } from "./Home";
import { Profile } from './Profile'

interface Props {
    ndk: NDK;
    userHexKey: string;
}

interface Note {
    content: string;
    tags: string[][];
}

interface Tag {
    0: string;
    1: string;
    [key: number]: string;
}

export const NoteCard = ({ ndk, userHexKey }: Props) => {

    const [kind1Events, setKind1Events] = useState<NDKEvent[]>([])
    const [followList, setFollowList] = useState<Array<string>>([])
    const [metadata, setMetadata] = useState<Record<string, Metadata>>({})
    const [replyTo, setReplyTo] = useState({});

    const imageRegex = /(https?:\/\/[^\s]+?\.(?:jpg|png|gif|mp4))/g
    const npubRegex = /npub:(\w+)/g;

    const profileRouteById = `/profile/${userHexKey}`


    const fetchFollowList = async () => {
        const filter: NDKFilter = {
            kinds: [3], authors: [userHexKey]
        }

        const events = await ndk.fetchEvents(filter)
        const newEventsArray = [...events]
        const followListKeys = [] as Array<string>
        newEventsArray[0].tags.forEach((innerArray) => followListKeys.push(innerArray[1]))

        if (followListKeys.length > 0 || followList.length > 0) {
            setFollowList(followListKeys)
            fetchNotes()

        } else {
            console.log('followListKeys.length: from the else statement', followListKeys.length)
        }
    }

    const fetchNotes = () => {
        const sub = ndk.subscribe({ kinds: [1], authors: followList, limit: 30 }, { closeOnEose: false })
        sub.on('event', (event) => {
            setKind1Events((events) => insertEventIntoDescendingList(events, event))
            fetchProfiles()
        })
        sub.on('eose', () => {
            // console.log('EOSE')
        })
        sub.on('notice', (notice) => {
            console.log('notice: ', notice)
        })
    }

    const fetchProfiles = () => {
        const pubkeysFromNotes = kind1Events.map((e) => e.pubkey)
        const sub = ndk.subscribe({ kinds: [0], authors: pubkeysFromNotes }, { closeOnEose: false })

        sub.on('event', (event) => {
            const metadata = JSON.parse(event.content) as Metadata
            setMetadata((current) => ({
                ...current,
                [event.pubkey]: metadata,
            }))
        })
        sub.on('eose', () => {
            // console.log('EOSE') // end of shared events.
        })
        sub.on('notice', (notice) => {
            console.log('notice: ', notice)
        })
    }

    const renderText = (content: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        return content.split(/\n/).map((part, index) => (
            <span key={index}>
                {part.split(/(\s+)/).map((subPart, subIndex) => {
                    if (imageRegex.test(subPart)) {
                        return null
                    } else if (urlRegex.test(subPart)) {
                        return (
                            <div>
                                <a href={subPart} key={`${index}-${subIndex}`} target="_blank" rel="noopener noreferrer">
                                    {subPart}
                                </a>
                            </div>
                        )
                    } else if (npubRegex.test(subPart)) {
                        return (
                            <span key={`${index}`}></span>
                        )

                    } else {
                        return <span key={`${index}-${subIndex}`}>{subPart}</span>
                    }
                })}
            </span>
        ));
    };

    const renderMedia = (content: string) => {
        const mediaRegex = /(https?:\/\/[^\s]+?\.(?:jpg|png|gif|mp4))/g;
        return content.split(mediaRegex).map((part, index) => (
            <div key={index}>
                {part.match(mediaRegex)?.map((subPart, subIndex) => {
                    const isVideo = subPart.endsWith('.mp4');
                    return isVideo ? (
                        <video className="note-video" key={`${index}-${subIndex}`} controls>
                            <source src={subPart} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img className="note-image" key={`${index}-${subIndex}`} src={subPart} alt="" />
                    );
                })}
            </div>
        ));
    };

    const fetchEvent = async (noteId: string) => {
        try {
            const filter: NDKFilter = { ids: [noteId] };
            const note = await ndk.fetchEvent(filter);

            if (!note) {
                return; // Exit if no note is found
            }

            const user = ndk.getUser({
                pubkey: note.pubkey,
            });

            const replyingToProfile = await user.fetchProfile();
            setReplyTo(prevState => ({
                ...prevState,
                [noteId]: replyingToProfile.name || replyingToProfile?.displayName || undefined
            }));
            console.log('replyTo: ', replyTo)
        } catch (error) {
            console.error(`Error fetching event for note ID ${noteId}:`, error);
            // Handle the error as needed
        }
    };


    useEffect(() => {
        kind1Events.forEach(note => {
            note.tags.forEach(tag => {
                if (tag[0] === "e" && !replyTo[tag[1]]) {
                    fetchEvent(tag[1]);
                }
            });
        });
    }, [kind1Events]);


    useEffect(() => {
        fetchFollowList()
        fetchProfiles()
    }, [])

    useEffect(() => {
        fetchNotes()
    }, [ndk, kind1Events, fetchNotes, fetchProfiles])


    return (
        <>
            {kind1Events.map((note, index) => {
                // Create a Set to collect unique user IDs
                const mentionedUserIds = new Set();
    
                // Iterate over tags to find relevant ones
                note.tags.forEach(tag => {
                    if (tag[0] === "e") {
                        // Assuming tag[1] contains the noteId
                        mentionedUserIds.add(tag[1]); // Adjust based on your data structure
                    }
                });
    
                // Get the first unique user ID from mentionedUserIds
                const firstUserId = Array.from(mentionedUserIds)[0]; // Get the first ID
                const firstUserName = firstUserId ? replyTo[firstUserId] : null; // Get the corresponding username
    
                return (
                    <div className="note" key={index}>
                        <div className="note-banner">
                            <Link to={profileRouteById}>
                                <img 
                                    src={metadata[note.pubkey]?.picture ?? `https://api.dicebear.com/8.x/bottts/svg?seed=${index}`} 
                                    className="profile-image" 
                                />
                            </Link>
                            <div className="note-banner2">
                                <h4>
                                    <span className="name">{metadata[note.pubkey]?.name}</span>
                                </h4>
    
                                <div className="tags">
                                    {firstUserName && (
                                        <span className="tag">
                                            Replying to {firstUserName}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="text-content">
                            {renderText(note.content)}
                            {renderMedia(note.content)}
                        </div>
                    </div>
                );
            })}
        </>
    );
}