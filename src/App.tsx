import { useState, useEffect } from 'react'
import NDK, { NDKNip07Signer, NDKUserProfile, NDKUser } from '@nostr-dev-kit/ndk'
import { Route, Routes } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import { Home } from './components/Home'
import { Nav } from "./components/Nav"
import { Landing } from "./components/Landing"
import { Profile } from "./components/Profile"

import './App.css'


function App() {

  const [userProfile, setUserProfile] = useState<NDKUserProfile>({})
  const [userNpub, setUserNpub] = useState<string>('')
  const [userHexKey, setUserHexKey] = useState<string>('')
  const [activeUser, setActiveUser] = useState<NDKUser>()

  const navigate = useNavigate()

  const defaultRelays = ["wss://relay.nostr.band", "wss://nos.lol", "wss://relay.damus.io"]
  const ndk = new NDK({
    explicitRelayUrls: defaultRelays,
    autoConnectUserRelays: false,
    autoFetchUserMutelist: false,
  })
  const signer = new NDKNip07Signer()
  ndk.signer = signer
  ndk.connect()


  const getUser = async () => {
    try {
      const user = await signer.user();

      if (!!user.npub) {
        setUserNpub(user.npub);
        setUserHexKey(user.pubkey);
        // console.log("userNpub, userHexKey set:", user.npub, user.pubkey);

        setActiveUser(user)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleClick = async () => {

    await signer.user();
    const user = ndk.getUser({ npub: userNpub })
    let profile = await user.fetchProfile()

    setUserProfile(profile as NDKUserProfile);
    navigate("/home");
  }

  useEffect(() => {
    getUser()

  }, [])
  


  return (
    <>
      <Nav userProfile={userProfile as NDKUserProfile} />
      <Routes>
        <Route path="/" element={<Landing handleClick={handleClick} />} />
        <Route path="/home" element={<Home defaultRelays={defaultRelays} userNpub={userNpub} userHexKey={userHexKey} userProfile={userProfile} />} />
        <Route path="/profile" element={<Profile userProfile={userProfile as NDKUserProfile} />} />
      </Routes>
    </>
  )
}

export default App
