import { useEffect, useState } from "react"
import NDK, { NDKFilter } from '@nostr-dev-kit/ndk'

import { NoteCard } from "./NoteCard"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { Metadata } from "./Home"

interface Props {
    notes: NDKEvent[];
    metadata: Record<string, Metadata>
    userHexKey: string;
    ndk: NDK;
}

export const NoteList = ({ ndk, userHexKey}: Props) => {

    return (
        <div className="feed" >
            <NoteCard ndk={ndk} userHexKey={userHexKey} />
        </div>
    )
    // return <div className="feed">
    //     <span className="loader"></span>
    // </div>
}