import { useState, useRef } from "react"
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { NoteCard } from "./NoteCard"

interface Props {
    kind1Events: Array<string>;
}

export const NoteList = ({ kind1Events, metadata }: any) => {

    const feedContainerRef = useRef<any>(null);
    console.log('notelist log')
    return (
        <div className="feed" >
            {kind1Events.map((event, index) => (
                metadata[event.pubkey]?.picture &&
                <NoteCard
                    key={index}
                    event={event}
                    metadata={metadata}
                    user={{
                        name: metadata[event.pubkey]?.name ?? metadata[event.pubkey]?.display_name,
                        image: metadata[event.pubkey]?.picture ?? `https://api.dicebear.com/8.x/bottts/svg?seed=${index}`,
                        lud16: metadata[event.pubkey]?.lud16
                    }}
                />
            ))}
        </div>
    )
}