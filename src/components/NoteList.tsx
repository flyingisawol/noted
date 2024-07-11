import { useState } from "react"
import { NoteCard } from "./NoteCard"


export const NoteList = ({ kind1Events, metadata }) => {

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
            {/* {kind1Events.length > 0 ? (
                <div></div>
        ) : (
            <span className="loader"></span>

        )} */}
        </div>
    )
}