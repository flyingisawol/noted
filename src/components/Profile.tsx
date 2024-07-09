import { useState, useEffect } from 'react'
import NDK, { NDKUserProfile } from '@nostr-dev-kit/ndk'
import { Link } from 'react-router-dom'


export const Profile = ({ userProfile }) => {

    return (
        <>
            <div className='profile-page'>
                <img className="banner" src={userProfile.banner} alt="" />
                <div className='profile-header'>
                    <img className="profile-page-image" src={userProfile.image} alt="" />
                </div>
                <div className='profile-content'>
                    <div className='content-box'></div>
                    <h2 className='profile-name'>{userProfile.name}</h2>
                    <img className="zap-icon" src="src/assets/flash.png" alt={userProfile.lud16} />
                </div>
                <div className='profile-content2'>
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
