import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NDK, { NDKEvent, NDKFilter, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { insertEventIntoDescendingList } from '../utils/helperFunctions'

import { Metadata } from "./Home";
import { Profile } from './Profile'

interface Props {
    ndk: NDK;
    userHexKey: string;
}

export const NoteCard = ({ ndk, userHexKey }: Props) => {

    const [kind1Events, setKind1Events] = useState<NDKEvent[]>([])
    const [followList, setFollowList] = useState<Array<string>>([])
    const [metadata, setMetadata] = useState<Record<string, Metadata>>({})
    const [processedContent, setProcessedContent] = useState();

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
            // console.log('fetchEventsSub EOSE')
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
            // console.log('profiles function EOSE') // end of shared events.
        })
        sub.on('notice', (notice) => {
            console.log('notice: ', notice)
        })
    }

    // fetch username for mentions
    const fetchUserName = async (npubMentioned: string) => {
        console.log('npub mention: ', npubMentioned)
        const user = ndk.getUser({ npub: npubMentioned })
        await user.fetchProfile()
        return `User${user}`
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
                    } else {
                        return <span key={`${index}-${subIndex}`}>{subPart}</span>;
                    }
                })}
            </span>
        ));
    };

    const renderImages = (content: string) => {
        const imageRegex = /(https?:\/\/[^\s]+?\.(?:jpg|png|gif))/g;
        return content.split(imageRegex).map((part, index) => (
            <div key={index}>
                {part.match(imageRegex)?.map((subPart, subIndex) => (
                    <img className="note-image" key={`${index}-${subIndex}`} src={subPart} alt="" />
                ))}
            </div>
        ));
    };



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
                return (
                    <div className="note" key={index}>
                        <div className="note-banner">
                            <Link to={profileRouteById}>
                                <img src={metadata[note.pubkey]?.picture ?? `https://api.dicebear.com/8.x/bottts/svg?seed=${index}`} className="profile-image" />
                            </Link>
                            <h4 className="name">{metadata[note.pubkey]?.name}</h4>
                        </div>
                        <div className="text-content">
                            {renderText(note.content)}
                            {renderImages(note.content)}
                        </div>

                    </div>
                )
            })}
        </>
    )
}