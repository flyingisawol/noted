import NDK, { NDKEvent, NDKKind, NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { useState } from 'react'
import { useNavigate } from "react-router-dom"

export const Create = ({ defaultRelays }) => {

    const [input, setInput ] = useState<string>("")
    const navigate = useNavigate()
    
    const signer = new NDKNip07Signer()
    const ndk = new NDK({ explicitRelayUrls: defaultRelays, signer: new NDKNip07Signer })


    // function to capture input, create as NDK event, to sign, and publish.
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault() // prevents page being refreshed

        const newNote = new NDKEvent(ndk)
        newNote.kind = 1
        newNote.content = input

        ndk.connect().then(() => {
            signer.user().then(async (user) => {
                if (!!user.npub) {
                    console.log("Permission granted to read their public key:", user.npub);
                }
            })
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