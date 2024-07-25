import { useState, useEffect } from 'react'
import NDK, { NDKUserProfile } from '@nostr-dev-kit/ndk'
import { Link } from 'react-router-dom'


export const Profile = ({ userProfile }: any) => {

    return (
        <>
            <div className='profile-page'>
                <img className="banner" src={userProfile.banner} alt="" />
                <div className='profile-header'>
                    <img className="profile-page-image" src={userProfile.image} alt="" />
                    <button className='zap'>
                    <img className="zap-icon" src="/assets/flash.png" alt={userProfile.lud16} />
                    </button>
                </div>
                <div className='profile-content2'>
                    <h2 className='profile-name'>{userProfile.name}</h2>
                    <p>{userProfile.about}</p>
                    <h3 className='profile-website'>{userProfile.website}</h3>

                <Link to="/home">
                    <button>back to feed</button>
                </Link>
                </div>
            </div>
        </>
    )

}
