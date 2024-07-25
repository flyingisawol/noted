import { useNavigate, Link } from "react-router-dom"
import { Login } from "./Login";
import { Create } from "./Create";

export const Nav = ({ userProfile, userNpub, userHexKey }: any) => {

    const navigate = useNavigate()

    const onClick = () => {
        userProfile = {
            about: '',
            banner: '',
            displayName: '',
            image: '',
            lud16: '',
            name: '',
            nip05: '',
            reactions: false,
            website: '',
          }
          userNpub = ''
          userHexKey = ''
        return navigate("/")
    }

    const profilePic = userProfile?.image ?? `https://api.dicebear.com/8.x/bottts/svg?seed=${userProfile?.pubkey ?? 'default'}`;

    return (
        <>
            <nav className="nav">
                <ul>
                    <li className="nav-left">
                        <button onClick={onClick}
                        >logout</button>
                    </li>
                    <li className="nav-middle">
                        <img src=""  className="logo" alt="" />
                    </li>
                    <li className="nav-right">
                        <Link to="/profile">
                            <img className="profile-pic" src={profilePic} alt="" />
                        </Link> 
                    </li>
                </ul>
            </nav>
        </>
    )
}