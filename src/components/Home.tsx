import { useState, useEffect, useRef } from 'react'
import NDK, { NDKEvent, NDKFilter, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { NoteList } from './NoteList'
import { Create } from './Create'

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
            <Create ndk={ndk}/>
            <NoteList userHexKey={userHexKey} ndk={ndk} />
        </>
    )
}