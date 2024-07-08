import { useState, useEffect } from 'react'
import NDK, { NDKNip07Signer, NDKUserProfile } from '@nostr-dev-kit/ndk'
import { Route, Routes } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { effect } from '@preact/signals-react'

import { Home } from './components/Home'
import { Nav } from "./components/Nav"
import { Landing } from "./components/Landing"
import { Profile } from "./components/Profile"

import './App.css'


function App() {

  const [userProfile, setUserProfile] = useState<NDKUserProfile>({})
  const [userNpub, setUserNpub] = useState<string>('')
  const [userHexKey, setUserHexKey] = useState<string>('')

  const navigate = useNavigate()

  const defaultRelays = ["wss://relay.damus.io", "wss://nos.lol", "wss://relay.primal.net"]

  const ndk = new NDK({
    explicitRelayUrls: defaultRelays,
    autoConnectUserRelays: false,
    autoFetchUserMutelist: false,
  })
  
  const signer =  new NDKNip07Signer()
  
  ndk.signer = signer
  
  const handleClick = async () => {
    signer.user().then((user) => {
      console.log('user = ', user)
      
      user.fetchProfile().then((profile) => {
        setUserProfile(profile as NDKUserProfile)
      })
      if (!!user.npub) {
        setUserNpub(user.npub)
        setUserHexKey(user.pubkey)
        console.log(userNpub, userHexKey)
      }
    })
    await ndk.connect()
    navigate("/home")
}

  return (
    <>
      <Nav userNpub={userNpub} userProfile={userProfile} />
      <Routes>
        <Route path="/" element={<Landing handleClick={handleClick} />} />
        <Route path="/home" element={<Home defaultRelays={defaultRelays} userNpub={userNpub} userHexKey={userHexKey} userProfile={userProfile} />} />
        <Route path="/profile" element={<Profile />} userProfile={userProfile} />
      </Routes>
    </>
  )
}

export default App
