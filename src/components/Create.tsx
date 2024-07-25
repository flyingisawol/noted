import NDK, { NDKNip07Signer, NDKEvent } from '@nostr-dev-kit/ndk'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"

interface Props {
    ndk: NDK;
}

export const Create = ({ ndk }: Props) => {

    const [input, setInput] = useState<string>("")

    const navigate = useNavigate()
      
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
     
        const newNote = new NDKEvent(ndk)
        newNote.kind = 1
        newNote.content = input,
        await newNote.publish()
        // setInput('')
        // navigate("/home")
    }

    const handleChange = (e: React.SyntheticEvent) => {
        const target = e.target as HTMLInputElement
        setInput(target.value)
    }

    return (
        <div className='write-stuff'>
            <form className="input-form" onSubmit={onSubmit} >
                <textarea className="input-note" placeholder="write stuff..." value={input} onChange={handleChange}></textarea>
                <button className="submit-button">submit</button>
            </form>
        </div>
    )
}