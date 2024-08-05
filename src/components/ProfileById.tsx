import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import NDK, { NDKEvent, NDKFilter, NDKUserProfile } from '@nostr-dev-kit/ndk'

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

    useEffect(() => {
        const user = ndk.getUser({ pubkey: id });
        try {
            const setUserProfile = async () => {
                let fetchedProfile = await user.fetchProfile()
                setProfile(fetchedProfile as NDKUserProfile)
            }
            setUserProfile()
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
                <p>{profile?.about}</p>
                <h3 className='profile-website'><a href={profile?.website}>{profile?.website}</a> </h3>

                <Link to="/home">
                    <button>back to feed</button>
                </Link>
            </div>
        </div>
    )
}
