import { useState, useEffect, useRef } from 'react'
import NDK, { NDKEvent, NDKFilter, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { UserProfile } from '../App'

import { NoteList } from './NoteList'

export interface Metadata {
    name?: string;
    about?: string;
    picture?: string;
    nip05?: string;
    display_name?: string;
    displayName?: string;
    lud16?: string;
}

export interface Props {
    userNpub: string;
    userHexKey: string;
    ndk: NDK;
}

export const Home = ({ ndk, userNpub, userHexKey }: Props) => {

    // nutzaps kind: 10019, 9321
    
    return (
        <>
            <NoteList userHexKey={userHexKey} ndk={ndk} />
        </>
    )
}