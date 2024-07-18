import { useEffect, useState } from "react"
import { NoteCard } from "./NoteCard"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { Metadata } from "./Home"

interface Props {
    notes: NDKEvent[];
    metadata: Record<string, Metadata>
}

export const NoteList = ({ notes, metadata }: Props) => {

    console.log('metadata: ', metadata)

    return (
        <div className="feed" >

            {notes.map((note, index) => (
                <NoteCard
                    key={index}
                    content={note.content}
                    user={{
                        name: metadata[note.pubkey]?.name ?? metadata[note.pubkey]?.display_name,
                        image: metadata[note.pubkey]?.picture ?? `https://api.dicebear.com/8.x/bottts/svg?seed=${index}`,
                        lud16: metadata[note.pubkey]?.lud16,
                        pubkey: note.pubkey,
                        about: metadata[note.pubkey]?.about
                    }}
                    created_at={note.created_at}
                    metadata={metadata}
                />
            ))}
        </div>
    )
    // return <div className="feed">
    //     <span className="loader"></span>
    // </div>
}