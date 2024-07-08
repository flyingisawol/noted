import { useState, useEffect } from 'react'
import NDK, { NDKEvent, NDKKind, NDKFilter, NDKUserProfile } from '@nostr-dev-kit/ndk'
import { Link } from 'react-router-dom'


export const Profile = ({ userProfile }) => {

    console.log('userProfile = ', userProfile);
    

    return (
        <>
            <div className='profile-page'>
                <p>{userProfile.name}</p>
                <p>{userProfile.about}</p>
                <p>{userProfile.website}</p>
                <p>{userProfile.lud16}</p>

                <Link to="/home">
                    <button>back to feed</button>
                </Link>
            </div>
        </>
    )

}
