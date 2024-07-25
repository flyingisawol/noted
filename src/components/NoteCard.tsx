import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NDK, { NDKEvent, NDKFilter, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { insertEventIntoDescendingList } from '../utils/helperFunctions'

import { Metadata } from "./Home";
import { Profile } from './Profile'

interface Props {
    ndk: NDK;
    userHexKey: string;

    user: {
        name: string;
        image: string;
        about: string;
        lud16: string;
        pubkey: string;
    };

    content: string;
    created_at: number | undefined;
    metadata: Record<string, Metadata>
}

export const NoteCard = ({ ndk, userHexKey }: Props) => {

    const [kind1Events, setKind1Events] = useState<NDKEvent[]>([])
    const [followList, setFollowList] = useState<Array<string>>([])
    const [metadata, setMetadata] = useState<Record<string, Metadata>>({})

    // const profileRouteById = `/profile/${userHexKey}`


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

    // trying to fetch username for mentions
    const fetchUserName = async (npubMention: string) => {
        const user = ndk.getUser({ npub: npubMention })
        await user.fetchProfile()
        return `User${user}`
    }

    useEffect(() => {
        fetchFollowList()
        console.log('followList useEffect')
    }, [])

    useEffect(() => {
        fetchNotes()
        console.log('fetchNotes useEffect')
    }, [fetchNotes, metadata])

    return (
        <>
            {kind1Events.map((note, index) => {
                return (
                    <div className="note" key={index}>
                        <div className="note-banner">
                            <Link to=''>
                                <img src={metadata[note.pubkey]?.picture ?? `https://api.dicebear.com/8.x/bottts/svg?seed=${index}`} className="profile-image" />
                            </Link>
                            <h4 className="name">{metadata[note.pubkey]?.name}</h4>
                        </div>
                        <div className="text-content">{note.content}</div>

                    </div>
                )
            })}
        </>
    )

    // return (
    //     <div className="note">
    //         <div className="note-banner">
    //             <Link to={profileRouteById}>
    //                 <img src={user.image} className="profile-image" />
    //             </Link>
    //             <h4 className="name">{user.name}</h4>
    //         </div>
    //         <div className="text-content">
    //             {processedContent.map((part, index) => (
    //                 <span key={index}>{part}</span>
    //             ))}
    //         </div>
    //         <div className="text-content">
    //             {renderText()}
    //             {processedContent}
    //         </div>
    //             {renderImages()}
    //     </div>
    // )
}

//                     notes.map((note, index) => {})
//                     key={index}
//                     content={note.content}
//                     user={{
//                         name: metadata[note.pubkey]?.name ?? metadata[note.pubkey]?.displayName,
//                         image: metadata[note.pubkey]?.picture ?? `https://api.dicebear.com/8.x/bottts/svg?seed=${index}`,
//                         lud16: metadata[note.pubkey]?.lud16,
//                         pubkey: note.pubkey,
//                         about: metadata[note.pubkey]?.about
//                     }}
//                     created_at={note.created_at}
//                     metadata={metadata}