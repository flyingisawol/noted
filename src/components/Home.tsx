import NDK, { NDKEvent, NDKNip07Signer, NDKFilter, NDKUserProfile } from '@nostr-dev-kit/ndk'
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
    userNpub: string;
    userHexKey: string;
    defaultRelays: Array<string>;
}

export const Home = ({ defaultRelays }: Props) => {

    const [kind1Events, setKind1Events] = useState<Array<NDKEvent>>([])
    const [followList, setFollowList] = useState<Array<string>>([])
    const [metadata, setMetadata] = useState<Object>({})
    const [userProfileData, setUserProfileData] = useState<NDKUserProfile>({})

    const [userNpub, setUserNpub] = useState<string>('')
    const [userHexKey, setUserHexKey] = useState<string>('')

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
        const sub = ndk.subscribe({ kinds: [1], authors: followList, limit: 50 }, { closeOnEose: false })
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

    const fetchFollowList = async () => {
        const filter: NDKFilter = {
            kinds: [3], authors: ["3492dd43d496a237f4441fd801f5078b63542c3e158ffea903cb020a1af4ffdd"]
        }
        let events = await ndk.fetchEvents(filter)
        const newEventsArray = [...events]
        const followListKeys = [] as Array<string>
        newEventsArray[0].tags.forEach((innerArray) => followListKeys.push(innerArray[1]))
        setFollowList(followListKeys)
        fetchEventsFromSub()
    }

    const fetchUserProfile = async () => {

        const signer = new NDKNip07Signer()
        ndk.signer = signer
        signer.user().then((user) => {

            if (!!user.npub) {
                setUserNpub(user.npub)
                setUserHexKey(user.pubkey)
            }
        })

        const user = ndk.getUser({ pubkey: userHexKey })
        user.fetchProfile().then((profile) => {
            setUserProfileData(profile as NDKUserProfile)
            fetchEventsFromSub() // This calls the firehose.
        })
    }

    useEffect(() => {
        ndk.connect().then(() => {
            fetchUserProfile()
            fetchFollowList()
            // fetchEventsFromSub() // This calls the firehose.
            // fetchProfilesFromNotes()
            // console.log(userHexKey, userNpub)
        })
    }, [])



    return (
        <>
            <Create
                defaultRelays={defaultRelays} />
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