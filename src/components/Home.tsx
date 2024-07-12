import { useState, useEffect } from 'react'
import NDK, { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk'
import { insertEventIntoDescendingList } from '../utils/helperFunctions'
import { useDebounce } from "use-debounce";

import { Create } from './Create'
import { NoteList } from './NoteList'

export interface Metadata {
    name?: string;
    display_name?: string;
    about?: string;
    picture?: string;
    nip05?: string;
    lud16?: string;
}

interface Props {
    defaultRelays: Array<string>;
    userNpub: string;
    userHexKey: string;
}

export const Home = ({ defaultRelays, userNpub, userHexKey }: Props) => {

    const [kind1Events, setKind1Events] = useState<NDKEvent[]>([])

    const [followList, setFollowList] = useState<Array<string>>([])
    const [metadata, setMetadata] = useState<Record<string, Metadata>>({})

    const ndk = new NDK({
        explicitRelayUrls: defaultRelays,
        autoConnectUserRelays: false,
        autoFetchUserMutelist: false,
    })

    // there remains some issue with useState, and state management relating to kind1Events state var. toggle the log triggers events.
    const fetchEventsFromSub = () => {

        const sub = ndk.subscribe({ kinds: [1], authors: followList, limit: 50 }, { closeOnEose: false })
        // console.log('fetchEvents')
        
        sub.on('event', (event: NDKEvent) => {
            setKind1Events((events: NDKEvent[]) => insertEventIntoDescendingList(events, event))
            // console.log('settingKind1Events: ', kind1Events)
            fetchProfilesFromNotes()
        })
        sub.on('eose', () => {
            // console.log('EOSE')
        })
        sub.on('notice', (notice) => {
            console.log('notice: ', notice)
        })
    }

    const fetchProfilesFromNotes = () => {
        // console.log('fetchingProfilesFromNotes Function')
        const pubkeysFromNotes = kind1Events.map((e) => e.pubkey)
        const sub = ndk.subscribe({ kinds: [0], authors: pubkeysFromNotes })

        sub.on('event', (event: NDKEvent) => {
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

    // gets users kind3 followList, to filter feed by this list.
    const fetchFollowList = async () => {

        const filter: NDKFilter = {
            kinds: [3], authors: [userHexKey]
        }

        await ndk.connect()
        let events = await ndk.fetchEvents(filter)

        const newEventsArray = [...events]

        const followListKeys = [] as Array<string>
        newEventsArray[0].tags.forEach((innerArray) => followListKeys.push(innerArray[1]))

        if (followListKeys.length > 0) {
            console.log('followListKeys.length: ', followListKeys.length)
            setFollowList(followListKeys)
            fetchEventsFromSub()
            console.log('calling fetch events from fetchFollowList function')
        } else {
            console.log('followListKeys.length: from the else statement', followListKeys.length)
        }

    }

    useEffect(() => {
        fetchFollowList()
        fetchEventsFromSub()
    }, [])

    return (
        <>
            <Create />
            <NoteList
                notes={kind1Events}
                metadata={metadata}
            />
        </>
    )
}