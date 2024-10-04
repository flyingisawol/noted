import { useState, useEffect } from 'react'
import NDK, { NDKUserProfile, NDKEvent } from '@nostr-dev-kit/ndk'
import { Link } from 'react-router-dom'
import { Metadata } from "./Home";
import { insertEventIntoDescendingList } from '../utils/helperFunctions'


export const Profile = ({ userProfile, ndk, userHexKey }: any) => {

    const [profileNotes, setProfileNotes] = useState<NDKEvent[]>([])

    const fetchNotes = () => {
        const sub = ndk.subscribe({ kinds: [1], authors: [userHexKey], limit: 25 }, { closeOnEose: false })
        sub.on('event', (event: NDKEvent) => {
            setProfileNotes((events) => insertEventIntoDescendingList(events, event))
            console.log('profile notes = ', profileNotes)
        })
        sub.on('eose', () => {
            // console.log('EOSE')
        })
        sub.on('notice', (notice) => {
            console.log('notice: ', notice)
        })
    }
    fetchNotes()

    const renderText = (content: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g
        const imageRegex = /(https?:\/\/[^\s]+?\.(?:jpg|png|gif|mp4))/g
        const npubRegex = /npub:(\w+)/g
        const nostrRegex = /nostr:[^\s]+/g

        // Normalize line breaks and split text into paragraphs
        const paragraphs = content
            .replace(/\r\n|\r/g, '\n') // Normalize \r\n and \r to \n
            .split('\n\n') // Split by two newlines for paragraphs

        return paragraphs.map((paragraph, index) => (
            <div key={index} style={{ marginBottom: '1em' }}> {/* Optional styling for spacing */}
                {paragraph.split(/(\s+)/).map((subPart, subIndex) => {
                    if (imageRegex.test(subPart)) {
                        return null
                    } else if (nostrRegex.test(subPart)) {
                        return (
                            <a href={subPart} key={`${index}-${subIndex}`} target="_blank" rel="noopener noreferrer">
                                {subPart}
                            </a>
                        )
                    } else if (urlRegex.test(subPart)) {
                        return (
                            <a href={subPart} key={`${index}-${subIndex}`} target="_blank" rel="noopener noreferrer">
                                {subPart}
                            </a>
                        )
                    } else if (npubRegex.test(subPart)) {
                        return (
                            <span key={`${index}`}></span>
                        )
                    } else {
                        return <span key={`${index}-${subIndex}`}>{subPart}</span>
                    }
                })}
            </div>
        ))
    }

    return (
        <div className='profile-page'>
            <img className="banner" src={userProfile.banner} alt="" />
            <div className='profile-header'>
                <img className="profile-page-image" src={userProfile.image} alt="" />
                <button className='zap'>
                    <img className="zap-icon" src="/assets/flash.png" alt={userProfile.lud16} />
                </button>
            </div>
            <div className='profile-content'>
                <h2 className='profile-name'>{userProfile.name}</h2>
                <p>{userProfile.about}</p>
                <h3 className='profile-website'>
                    <a href={userProfile.website}> {userProfile.website}</a>
                </h3>
                <div className='heading'>Notes</div>
                {profileNotes.map((note, index) => {
                    return (
                        <div className="note" key={index}>
                            <div className="note-banner">
                                <img
                                    src={userProfile.image ?? `https://api.dicebear.com/8.x/bottts/svg?seed=${index}`}
                                    className="profile-image"
                                />
                                <div className="note-banner2">
                                    
                                </div>
                            </div>
                            <div className="text-content">
                                {renderText(note.content)}
                                {/* {renderMedia(note.content)} */}
                            </div>
                        </div>
                    )
                })}

                <Link to="/home">
                    <button>back to feed</button>
                </Link>
            </div>
        </div>
    )

}
