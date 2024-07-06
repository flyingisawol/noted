import { useState, useEffect, useRef } from "react"
import { NoteCard } from "./NoteCard"



export const NoteList = ({ kind1Events, userProfileData, metadata }: any) => {

    const feedContainerRef = useRef<any>(null);

    return (
            <div className="feed" ref={feedContainerRef}>

            {kind1Events.map((event, index) => (
                metadata[event.pubkey]?.picture &&
                <NoteCard
                key={index}
                userProfileData={userProfileData}
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