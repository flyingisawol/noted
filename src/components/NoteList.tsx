import { useEffect, useState } from "react"
import NDK, { NDKFilter } from '@nostr-dev-kit/ndk'

import { NoteCard } from "./NoteCard"


interface Props {
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