import NDK, { NDKNip07Signer, NDKEvent } from '@nostr-dev-kit/ndk'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"

interface Props {
    ndk: NDK;
}

export const Reply = ({ ndk }: Props) => {

    const [input, setInput] = useState<string>("")

    const navigate = useNavigate()
      
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
     
        const newNote = new NDKEvent(ndk)
        newNote.kind = 1
        newNote.content = input
        await newNote.publish()
        setInput('')
    }

    const handleChange = (e: React.SyntheticEvent) => {
        const target = e.target as HTMLInputElement
        setInput(target.value)
    }

    return (
        <div className='reply-card'>
            <form className="reply-form" onSubmit={onSubmit} >
                <textarea className="reply-input" placeholder="..." value={input} onChange={handleChange}></textarea>
                <button className="reply-submit">submit</button>
            </form>
        </div>
    )
}