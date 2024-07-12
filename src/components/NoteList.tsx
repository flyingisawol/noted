import { useEffect, useState } from "react"
import { NoteCard } from "./NoteCard"
import { NDKEvent } from "@nostr-dev-kit/ndk"
import { Metadata } from "./Home"

interface Props {
    notes: NDKEvent[];
    metadata: Record<string, Metadata>
}

export const NoteList = ({ notes, metadata }: Props) => {

    // console.log('notelist notes.length: ',notes.length)

    return (
        <div className="feed" >
            {notes.map((note, index) => (
                metadata[note.pubkey]?.picture &&
                <NoteCard
                    key={index}
                    content={note.content}
                    user={{
                        name: metadata[note.pubkey]?.name ?? metadata[note.pubkey]?.display_name,
                        image: metadata[note.pubkey]?.picture ?? `https://api.dicebear.com/8.x/bottts/svg?seed=${note.id}`,
                        lud16: metadata[note.pubkey]?.lud16,
                        pubkey: note.pubkey
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