import { useState, useEffect } from 'react'
import NDK, { NDKEvent, NDKFilter } from '@nostr-dev-kit/ndk'
import { insertEventIntoDescendingList } from '../utils/helperFunctions'

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
    })
    ndk.connect()

    const fetchProfilesFromNotes = () => {
        const pubkeysFromNotes = kind1Events.map((e) => e.pubkey)
        // console.log('pubkeysfromnotes', pubkeysFromNotes)
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
            kinds: [3], authors: [userHexKey]
        }
        const events = await ndk.fetchEvents(filter)

        const newEventsArray = [...events]
        
        const followListKeys = [] as Array<string>
        newEventsArray[0].tags.forEach((innerArray) => followListKeys.push(innerArray[1]))

        if (followListKeys.length > 0 || followList.length > 0 ) {
            console.log('followListKeys: ', followListKeys.length)
            setFollowList(followListKeys)
            fetchEventsFromSub()

        } else {
            fetchEventsFromSub()
            console.log('followListKeys.length: from the else statement', followListKeys.length)
        }
    }

    const fetchEventsFromSub = () => {
        const sub = ndk.subscribe({ kinds: [1], authors: followList})
        sub.on('event', (event) => {
            setKind1Events((events) => insertEventIntoDescendingList(events, event))
            console.log('subscription events: ', kind1Events.length)
        })
        sub.on('eose', () => {
            // console.log('EOSE')
        })
        sub.on('notice', (notice) => {
            console.log('notice: ', notice)
        })
    }

    fetchFollowList()
    fetchEventsFromSub()
    fetchProfilesFromNotes()

    return (
        <>
            <Create pubkey={userHexKey} />
            <NoteList
                notes={kind1Events}
                metadata={metadata}
            />
        </>
    )
}