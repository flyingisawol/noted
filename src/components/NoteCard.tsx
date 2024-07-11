import { Link } from "react-router-dom";
import { NDKEvent } from "@nostr-dev-kit/ndk";
import { Metadata } from "./Home";
import { Profile } from './Profile'

export interface Props {
    user: {
        name: string;
        image: string;
        lud16: string;
    }
    metadata: Record<string, Metadata>
}

export const NoteCard = ({ user, event }) => {
    
        return (
            <div className="note">
                <div className="note-banner">
                    <Link to="/profile">
                        <img src={user.image} className="profile-image" />
                    </Link>
                    <h4 className="name">{user.name}</h4>
                </div>
                <p className="note-content">
                    {event.content}
                </p>
            </div>
        )
}