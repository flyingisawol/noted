import { NDKEvent } from "@nostr-dev-kit/ndk";
import { Metadata } from "./Home";
import { Link } from "react-router-dom";
import { Profile } from './Profile'

export interface Props {
    event: string;
    user: {
        name: string;
        about: string;
        image: string;
        npub: string;
        lud16: string;
        nip05: string;
    }
    metadata: Record<string, Metadata>
}

// this is currently borked. experimenting w ternarys
export const NoteCard = ({ event, metadata }: Props) => {

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