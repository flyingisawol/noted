import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

export const ProfileById = () => {

    const { id } = useParams()

    return (
        <>
            <div className='profile-page'>
                <h3>hello world, i am the profile page by userID</h3>
                {/* <h3>{name}</h3> */}
                {/* <img src={pic} alt="" /> */}
                <Link to="/home">
                    <button>back to feed</button>
                </Link>
            </div>
        </>
    )

}
