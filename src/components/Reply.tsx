import NDK, { NDKEvent } from '@nostr-dev-kit/ndk'
import { useState } from 'react'

interface Props {
    ndk: NDK;
    onClose: any;
    isActive: any;
    noteId: any;
}

export const Reply = ({ ndk, onClose, isActive, noteId }: Props) => {
    // if (!isActive) return null;

    const [input, setInput] = useState<string>("")

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const replyNote = new NDKEvent(ndk)

        replyNote.kind = 1
        replyNote.content = input
        replyNote.tags = [
            ["t", "reply"],
            ["e", noteId]
        ]
        await replyNote.publish()
        setInput('')
    }

    const handleChange = (e: React.SyntheticEvent) => {
        const target = e.target as HTMLInputElement
        setInput(target.value)
    }

    return (
        <div className='reply-card'>
            <form className="reply-form" onSubmit={onSubmit} >
                <button className='reply-close' onClick={onClose}>x</button>
                <span>{noteId}</span>
                <textarea className="reply-input" placeholder="..." value={input} onChange={handleChange}></textarea>
                <button className="reply-submit">submit</button>
            </form>
        </div>
    )
}