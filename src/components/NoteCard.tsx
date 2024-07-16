import { Link } from "react-router-dom";
import { Metadata } from "./Home";
import { Profile } from './Profile'

interface Props {
    user: {
        name: string;
        image: string;
        about: string;
        lud16: string;
        pubkey: string;
    };
    content: string;
    created_at: number;
    metadata: Record<string, Metadata>
}

export const NoteCard = ({ content, user, created_at, metadata }: Props) => {

    const profileRouteById = `/profile/${user.pubkey}`

    const imageRegex = /(https?:\/\/[^\s]+?\.(?:jpg|png|gif))/g

    const renderContent = () => {
        const parts = content.split(/\n/);

        return parts.flatMap((part, index) => {
            const subParts = part.split(/(\s+)/);

            const mappedSubParts = subParts.map((subPart, subIndex) => {
                if (imageRegex.test(subPart)) {
                    return <img className="note-image" key={`${index}-${subIndex}`} src={subPart} alt="" />;
                } else {
                    return <span key={`${index}-${subIndex}`}>{subPart}</span>;
                }
            });

            // Add <br /> after each part except the last one
            return index < parts.length - 1 ? [...mappedSubParts, <br key={`br-${index}`} />] : mappedSubParts;
        });
    };

    return (
        <div className="note">
            <div className="note-banner">
                <Link to={profileRouteById}>
                    <img src={user.image} className="profile-image" />
                </Link>
                <h4 className="name">{user.name}</h4>
            </div>
            <div className="note-content">
                {renderContent()}
            </div>
        </div>
    )
}