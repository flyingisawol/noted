import { useState, useEffect } from 'react'
import NDK, { NDKNip07Signer } from '@nostr-dev-kit/ndk'
import { Route, Routes } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { effect } from '@preact/signals-react'

import { Home } from './components/Home'
import { Nav } from "./components/Nav"
import { Landing } from "./components/Landing"
import { Profile } from "./components/Profile"

import './App.css'

function App() {

  const [userNpub, setUserNpub] = useState<string>('')
  const [userHexKey, setUserHexKey] = useState<string>('')

  const navigate = useNavigate()

  const defaultRelays = ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.primal.net"]

  const ndk = new NDK({ 
    explicitRelayUrls: defaultRelays, 
    autoConnectUserRelays: false,
    autoFetchUserMutelist: false, 
  })

  const handleClick = async () => {
    const signer = new NDKNip07Signer()
    ndk.signer = signer

    signer.user().then((user) => {
      if (!!user.npub) {
        setUserNpub(user.npub)
        setUserHexKey(user.pubkey)
      }
    })
    navigate("/home")
  }

  return (
    <>
      <Nav loggedInUser={userNpub} defaultRelays={defaultRelays} />
      <Routes>
        <Route path="/" element={<Landing onClick={handleClick} />} />
        <Route path="/home" element={<Home defaultRelays={defaultRelays} />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  )
}

export default App
