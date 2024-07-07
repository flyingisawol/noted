import NDK, { NDKEvent, NDKNip07Signer, NDKFilter, NDKUserProfile, NDKUser } from '@nostr-dev-kit/ndk'
import { useState, useEffect, useRef, useCallback } from 'react'
import { nip19 } from 'nostr-tools'
import { Create } from './Create'
import { NoteCard } from './NoteCard'
import { NoteList } from './NoteList'

export interface Metadata {
    name?: string;
    picture?: string;
    nip05?: string;
    about?: string;
    lud16?: string;

    metadata: Record<string, Metadata>
}

export interface UserProfileData {
    name: string;
    picture: string;
    nip05: string;
    about: string;
    lud16: string;
}

interface Props {
    defaultRelays: Array<string>;
    userNpub: string;
    userHexKey: string;
}

export const Home = ({ defaultRelays, userNpub, userHexKey }: Props, { userProfile }: NDKUserProfile) => {

    const [kind1Events, setKind1Events] = useState<Array<NDKEvent>>([])
    const [followList, setFollowList] = useState<Array<string>>([])
    const [metadata, setMetadata] = useState<Object>({})
    const [userProfileData, setUserProfileData] = useState<NDKUserProfile>({})
    const [showEvents, setShowEvents] = useState<Boolean>(true)
    const [fetchingEvents, setFetchingEvents] = useState<Boolean>(false)
    const [isScrolling, setIsScrolling] = useState<Boolean>(false);
    const feedContainerRef = useRef<any>(null);

    const ndk = new NDK({
        explicitRelayUrls: defaultRelays,
        autoConnectUserRelays: false,
        autoFetchUserMutelist: false,
    })

    const fetchEventsFromSub = async () => {
        console.log('searching for notes')
        const sub = ndk.subscribe({ kinds: [1], authors: followList, limit: 50 }, { closeOnEose: false })
        console.log('followList = ', followList)
        await sub.on('event', (event) => {
            setKind1Events((events) => insertEventIntoDescendingList(events, event))
            fetchProfilesFromNotes()
        })
        sub.on('eose', () => {
            // console.log('EOSE')
        })
        sub.on('notice', (notice) => {
            console.log('notice: ', notice)
        })
    }

    // orders firehose feed into descending list 
    function insertEventIntoDescendingList<T extends NDKEvent>(
        sortedArray: T[],
        event: T
    ) {
        let start = 0;
        let end = sortedArray.length - 1;
        let midPoint;
        let position = start;

        if (end < 0) {
            position = 0;
        } else if (event.created_at < sortedArray[end].created_at) {
            position = end + 1;
        } else if (event.created_at >= sortedArray[start].created_at) {
            position = start;
        } else
            while (true) {
                if (end <= start + 1) {
                    position = end;
                    break;
                }
                midPoint = Math.floor(start + (end - start) / 2);
                if (sortedArray[midPoint].created_at > event.created_at) {
                    start = midPoint;
                } else if (sortedArray[midPoint].created_at < event.created_at) {
                    end = midPoint;
                } else {
                    position = midPoint;
                    break;
                }
            }

        // insert when num is NOT already in (no duplicates)
        if (sortedArray[position]?.id !== event.id) {
            return [
                ...sortedArray.slice(0, position),
                event,
                ...sortedArray.slice(position),
            ];
        }
        return sortedArray
    }

    // fetching kind0 profile metadata to display user profile.
    const fetchProfilesFromNotes = () => {

        const pubkeysFromNotes = kind1Events.map((e) => e.pubkey)
        const sub = ndk.subscribe({ kinds: [0], authors: pubkeysFromNotes })

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

    // followList array 

    // remove hardcoded pubkey
    const fetchFollowList = async () => {
        console.log('pubkeys= ', userNpub, userHexKey)
        const filter: NDKFilter = {
            kinds: [3], authors: [userHexKey]
        }
        let events = await ndk.fetchEvents(filter)
        const newEventsArray = [...events]
        const followListKeys = [] as Array<string>
        newEventsArray[0].tags.forEach((innerArray) => followListKeys.push(innerArray[1]))
        setFollowList(followListKeys)
        fetchEventsFromSub()
    }
    
    useEffect(() => {
        ndk.connect().then(() => {
            // fetchEventsFromSub() // This calls the firehose.
            fetchFollowList()
        })
    }, [])

    return (
        <>
            <Create />
            <div className='notelist'>
                <NoteList
                    kind1Events={kind1Events}
                    metadata={metadata}
                    userProfileData={userProfileData}
                    isScrolling={isScrolling} />
            </div>
        </>
    )
}