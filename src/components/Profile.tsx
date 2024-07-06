import { useState, useEffect } from 'react'
import NDK, { NDKEvent, NDKKind, NDKFilter, NDKUserProfile } from '@nostr-dev-kit/ndk'
import { Link } from 'react-router-dom'

export const Profile = ({ userProfileData }: any) => {

    console.log(userProfileData);
    

    // const [userProfileData, setUserProfileData] = useState<Object>({})

    // const defaultRelays = ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.primal.net"]
    // const ndk = new NDK({ explicitRelayUrls: defaultRelays })

    // const fetchUserProfile = async () => {
    //     const ak = ndk.getUser({ npub: 'npub1xjfd6s75j63r0azyrlvqrag83d34gtp7zk8la2grevpq5xh5llws9lwuey' })

    //     await ak.fetchProfile().then((user) => {
    //         setUserProfileData(user as NDKUserProfile)
    //     })
    // }

    // this is needed to render the about section and add line breaks. How to check content for this ?
    // const about = userProfileData.about;
    // const aboutSplit = about.split(/\n\n/)


    // useEffect(() => {
    //     ndk.connect().then(() => {
    //         fetchUserProfile()
    //     })
    // }, [])

    return (
        <>
            <div className='profile-page'>
                

                <Link to="/home">
                    <button>back to feed</button>
                </Link>
            </div>
        </>
    )

}
