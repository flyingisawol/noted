import { useNavigate, Link } from "react-router-dom"
import { Login } from "./Login";
import { Create } from "./Create";

export const Nav = ({ userProfile, userNpub, userHexKey, onLogout }: any) => {

    const navigate = useNavigate()

    const profilePic = userProfile?.image ?? `https://api.dicebear.com/8.x/bottts/svg?seed=${userProfile?.pubkey ?? 'default'}`;

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
                        <Link to="/profile">
                        {userNpub.length > 0 &&
                            <img className="profile-pic" src={profilePic} alt="" />
                        }
                        </Link> 
                    </li>
                </ul>
            </nav>
        </>
    )
}