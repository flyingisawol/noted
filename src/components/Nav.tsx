import { useNavigate, Link } from "react-router-dom"
import { Login } from "./Login";
import { Create } from "./Create";

export const Nav = ({ userProfile }: any) => {

    const navigate = useNavigate()

    const onClick = () => {
        return navigate("/")
    }

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
                            <img className="profile-pic" src={userProfile.image} alt="" />
                        </Link> 
                    </li>
                </ul>
            </nav>
        </>
    )
}