import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import NDK, { NDKUserProfile } from '@nostr-dev-kit/ndk'


interface Props {
    ndk: NDK;
}

interface Profile {
    about: string;
    banner: string;
    displayName: string;
    image: string;
    lud16: string;
    name: string;
    nip05: string;
    reactions: boolean;
    website: string;
}

export const ProfileById = ({ ndk }: Props) => {
    const { id } = useParams()
    const [profile, setProfile] = useState<NDKUserProfile>()
    const [loading, setLoading] = useState(true)

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

    useEffect(() => {
        const user = ndk.getUser({ pubkey: id });
        console.log(user)

        try {
            const setUserProfile = async () => {
                let fetchedProfile = await user.fetchProfile()
                setProfile(fetchedProfile as NDKUserProfile)
            }
            setUserProfile()
            console.log(profile)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [ndk])

    if (loading) {
        console.log('loading: ', loading)
        return (
            <span className="loader"></span>
        )
    }

    return (
        <div className='profile-page'>
            <img className="banner" src={profile?.banner} alt="" />
            <div className='profile-header'>
                <img className="profile-page-image" src={profile?.image} alt="" />
                <button className='zap'>
                    <img className="zap-icon" src="/assets/flash.png" alt={profile?.lud16} />
                </button>
            </div>
            <div className='profile-content'>
                <h2 className='profile-name'>{profile?.name}</h2>
                {/* <p>{renderText(profile)}</p> */}
                <h3 className='profile-website'><a href={profile?.website}>{profile?.website}</a> </h3>

                <Link to="/home">
                    <button>back to feed</button>
                </Link>
            </div>
        </div>
    )
}
