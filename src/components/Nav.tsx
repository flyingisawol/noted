import { useNavigate, Link } from "react-router-dom"
import { Login } from "./Login";
import { Create } from "./Create";
import { NDKUserProfile } from "@nostr-dev-kit/ndk";


export const Nav = ({ userProfile }) => {

    const navigate = useNavigate()

    const onClick = () => {
        return navigate("/")
    }

    // lets get this displaying profile image once logged in. would this link to profile page?

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
                        <Link to="/profile" userProfile={userProfile}>
                            <img className="profile-pic" src={userProfile.image} alt="" />
                        </Link> 
                    </li>
                </ul>
            </nav>
        </>
    )
}