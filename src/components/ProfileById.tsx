import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'

interface Props {
    name: string;
    pic: string;
}

export const ProfileById = ({ name, pic }: Props) => {

    const { id } = useParams()

    return (
        <>
            <div className='profile-page'>
                <h3>hello world, i am the profile page by userID</h3>
                <h3>{name}</h3>
                <img src={pic} alt="" />
                <Link to="/home">
                    <button>back to feed</button>
                </Link>
            </div>
        </>
    )

}
