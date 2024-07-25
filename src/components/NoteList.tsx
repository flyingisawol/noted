import { useEffect, useState } from "react"
import NDK, { NDKFilter } from '@nostr-dev-kit/ndk'

import { NoteCard } from "./NoteCard"
import { Create } from './Create'


interface Props {
    userHexKey: string;
    ndk: NDK;
}

export const NoteList = ({ ndk, userHexKey}: Props) => {

    return (
        <div className="feed" >
            <Create ndk={ndk}/>
            <NoteCard ndk={ndk} userHexKey={userHexKey} />
        </div>
    )
    // return <div className="feed">
    //     <span className="loader"></span>
    // </div>
}