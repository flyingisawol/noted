import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NDK, { NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { Login } from "./Login"

export const Landing = () => {

    return (
        <div className="landing">
            <div className="login-page">
            <img className="login-logo" src="/assets/noteBubble.png" alt="noted speech bubble" />
        </div>
        </div>
    )
}