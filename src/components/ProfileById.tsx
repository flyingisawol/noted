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
    const [profile, setProfile] = useState<NDKUserProfile>()
    const { id } = useParams()

    useEffect(() => {
        const user = ndk.getUser({pubkey: id});
        const setUserProfile = async () => {
            let fetchedProfile = await user.fetchProfile()
            setProfile(fetchedProfile as NDKUserProfile)
        }
        setUserProfile()
    },[ndk])

    return (
        <>
            <div className='profile-page'>
                <img className="banner" src={profile?.banner} alt="" />
                <div className='profile-header'>
                    <img className="profile-page-image" src={profile?.image} alt="" />
                    <button className='zap'>
                    <img className="zap-icon" src="/assets/flash.png" alt={profile?.lud16} />
                    </button>
                </div>
                <div className='profile-content2'>
                    <h2 className='profile-name'>{profile?.name}</h2>
                    <p>{profile?.about}</p>
                    <h3 className='profile-website'>{profile?.website}</h3>

                <Link to="/home">
                    <button>back to feed</button>
                </Link>
                </div>
            </div>
        </>
    )
}
