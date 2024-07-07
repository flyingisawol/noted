import { useNavigate, Link } from "react-router-dom"
import { Login } from "./Login";
import { Create } from "./Create";

interface Props {
    userNpub: string;
}

export const Nav = ({ userNpub, }: Props) => {

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
                        <Link to="/profile">
                            <img className="profile-pic" src="http://rejecttheframe.xyz/AK.png" alt="" />
                        </Link> 
                    </li>
                </ul>
            </nav>
        </>
    )
}