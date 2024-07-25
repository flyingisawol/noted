import { NoteCard } from "../components/NoteCard";

const [processedContent, setProcessedContent] = useState<string[]>([]);
    
const imageRegex = /(https?:\/\/[^\s]+?\.(?:jpg|png|gif|mp4))/g
const npubRegex = /npub:(\w+)/g;

export const renderImages = () => {
    const imageRegex = /(https?:\/\/[^\s]+?\.(?:jpg|png|gif))/g;
    return content.split(imageRegex).map((part, index) => (
        <div key={index}>
            {part.match(imageRegex)?.map((subPart, subIndex) => (
                <img className="note-image" key={`${index}-${subIndex}`} src={subPart} alt="" />
            ))}
        </div>
    ));
};

export const renderText = () => {
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

export const processContent = async () => {
    let processed = await Promise.all(
        content.split(/\n/).map(async (part, index) => {
            return await Promise.all(
                part.split(/(\s+)/).map(async (subPart, subIndex) => {
                    const match = npubRegex.exec(subPart);
                    if (match) {
                        const npubMention = match[1];
                        const userName = await fetchUserName(npubMention);
                        console.log('username: ', userName)
                        return `@${userName}`;
                    } else {
                        return subPart;
                    }
                })
            );
        })
    );
    setProcessedContent(processed.flat());
};