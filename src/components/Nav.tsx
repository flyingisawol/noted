import { useState } from 'react'
import { Link } from "react-router-dom"
import { Login } from "./Login";
import { Create } from "./Create";

export const Nav = ({ userProfile, userNpub, onLogout, handleSignIn, isLoggedIn }: any) => {
    
    
    const profilePic = userProfile?.image ?? `https://api.dicebear.com/8.x/bottts/svg?seed=${userProfile?.pubkey ?? 'default'}`;
    console.log(isLoggedIn)
    return (
        <>
            <nav className="nav">
                <ul>
                    <li className="nav-left">
                        {userNpub.length > 0 && 
                        <button onClick={onLogout}
                        >logout</button>}
                    </li>
                    <li className="nav-middle">
                        {userNpub.length > 0 &&
                        <img src="/assets/noteBubble.png"  className="logo" alt="" />
                        }
                    </li>
                    <li className="nav-right">
                        {isLoggedIn ? 
                        <Link to="/profile">
                        {userNpub.length > 0 &&
                            <img className="profile-pic" src={profilePic} alt="" />
                        }
                        </Link> 
                        : 
                        <button onClick={handleSignIn}>sign in</button>
                        }
                    </li>
                </ul>
            </nav>
        </>
    )
}