import NDK, { NDKNip07Signer, NDKEvent } from '@nostr-dev-kit/ndk'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"

export const Create = () => {

    const [input, setInput ] = useState<string>("")
    const navigate = useNavigate()
    
    const signer = new NDKNip07Signer()
    const ndk = new NDK({ 
        explicitRelayUrls: [
            "wss://umbrel.local:4848",
            "wss://relay.damus.io", 
            "wss://nos.lol", 
            "wss://relay.primal.net"
        ], 
        signer: new NDKNip07Signer, 
    })

    // figure out why relay not able to receive when publishing note. !!!!

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // prevents page being refreshed

        const newNote = new NDKEvent(ndk)
        newNote.kind = 1
        newNote.content = input
        
        signer.user().then(async (user) => {
            if (!!user.npub) {
            }
            newNote.publish()
        })
        navigate("/home")
    }

    const handleChange = (e: React.SyntheticEvent) => {
        const target = e.target as HTMLInputElement
        setInput(target.value)
    }

    return (
        <>
            <form className="input-form" onSubmit={onSubmit} name=''>
                <textarea className="input-note" placeholder="write stuff..." value={input} onChange={handleChange}></textarea>
            <button className="submit-button">submit</button>
            </form>
        </>
    )
}