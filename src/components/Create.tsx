import NDK, { NDKNip07Signer, NDKEvent } from '@nostr-dev-kit/ndk'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"

interface Props {
    pubkey: string;
}

export const Create = ({ pubkey }: Props) => {

    const [input, setInput] = useState<string>("")
    const navigate = useNavigate()

    const ndk = new NDK({
        explicitRelayUrls: ["wss://relay.primal.net", "wss://relay.nostr.band", "wss://relay.damus.io", "wss://nos.lol"], signer: new NDKNip07Signer
    })

      
    const onSubmit = async () => {
     
        const newNote = new NDKEvent(ndk)
        newNote.kind = 1
        newNote.content = input,
        await newNote.publish()
    }

    const handleChange = (e: React.SyntheticEvent) => {
        const target = e.target as HTMLInputElement
        setInput(target.value)
        console.log(target.value)
    }

    return (
        <div className='write-stuff'>
            <form className="input-form" onSubmit={onSubmit} name=''>
                <textarea className="input-note" placeholder="write stuff..." value={input} onChange={handleChange}></textarea>
                <button className="submit-button">submit</button>
            </form>
        </div>
    )
}