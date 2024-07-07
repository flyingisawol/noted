import { useState } from "react"
import { useNavigate } from "react-router-dom"
import NDK, { NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { Login } from "./Login"

export const Landing = ({ handleClick }: any) => {

    return (
        <div className="landing">
            <Login handleClick={handleClick} />
        </div>
    )
}