import { Link } from "react-router-dom";
import { Metadata } from "./Home";
import { Profile } from './Profile'

interface Props {
    user: {
        name: string | undefined;
        image: string | undefined;
        about: string | undefined;
        lud16: string | undefined;
        pubkey: string;
    };
    content: string;
    created_at: number | undefined;
    metadata: Record<string, Metadata>
}

export const NoteCard = ({ content, user, created_at, metadata }: Props) => {

    const profileRouteById = `/profile/${user.pubkey}`

    const imageRegex = /(https?:\/\/[^\s]+?\.(?:jpg|png|gif|mp4))/g

    const renderImages = () => {
        const imageRegex = /(https?:\/\/[^\s]+?\.(?:jpg|png|gif))/g;
        return content.split(imageRegex).map((part, index) => (
            <div key={index}>
                {part.match(imageRegex)?.map((subPart, subIndex) => (
                    <img className="note-image" key={`${index}-${subIndex}`} src={subPart} alt="" />
                ))}
            </div>
        ));
    };
    
    const renderText = () => {
        return content.split(/\n/).map((part, index) => (
            <span key={index}>
                {part.split(/(\s+)/).map((subPart, subIndex) => {
                    if (imageRegex.test(subPart)) {
                        return null; // Ignore images in the text content rendering
                    } else {
                        return <span key={`${index}-${subIndex}`}>{subPart}</span>;
                    }
                })}
            </span>
        ));
    };

    return (
        <div className="note">
            <div className="note-banner">
                <Link to={profileRouteById}>
                    <img src={user.image} className="profile-image" />
                </Link>
                <h4 className="name">{user.name}</h4>
            </div>
            <div className="text-content">
                {renderText()}
            </div>
                {renderImages()}
        </div>
    )
}