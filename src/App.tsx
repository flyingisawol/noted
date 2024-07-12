import { useState, useEffect } from 'react'
import NDK, { NDKNip07Signer, NDKUser, NDKUserProfile } from '@nostr-dev-kit/ndk'
import { Route, Routes } from "react-router-dom"
import { useNavigate } from "react-router-dom"

import { Home } from './components/Home'
import { Nav } from "./components/Nav"
import { Landing } from "./components/Landing"
import { Profile } from "./components/Profile"
import { ProfileById } from './components/ProfileById'

import './App.css'

export interface UserProfile {
  about: string;
  banner: string;
  displayName: string;
  image: string;
  lud16: string;
  name: string;
  nip05: string;
  reactions: boolean;
  website: string;
}

function App() {

  const [userProfile, setUserProfile] = useState<UserProfile>({
    about: '',
    banner: '',
    displayName: '',
    image: '',
    lud16: '',
    name: '',
    nip05: '',
    reactions: false,
    website: '',
  })
  const [userNpub, setUserNpub] = useState<string>('')
  const [userHexKey, setUserHexKey] = useState<string>('')
  const [activeUser, setActiveUser] = useState<NDKUser>()

  const navigate = useNavigate()

  const defaultRelays = [
    "wss://nos.lol", 
    "wss://relay.primal.net", 
    "wss://relay.nostr.band", 
    "wss://relay.damus.io"
  ]

  const ndk = new NDK({
    explicitRelayUrls: defaultRelays,
    autoConnectUserRelays: false,
    autoFetchUserMutelist: false,
  })

  const signer = new NDKNip07Signer()
  ndk.signer = signer

  const getUser = async () => {
    try {
      const user = await signer.user();

      if (!!user.npub) {
        setUserNpub(user.npub);
        setUserHexKey(user.pubkey);
        console.log("userNpub, userHexKey set:", user.npub, user.pubkey);
        setActiveUser(user)
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleClick = async () => {
    await ndk.connect()

    const user = ndk.getUser({ npub: userNpub })

    let profile = await user.fetchProfile()
    setUserProfile(profile as UserProfile | any);
    navigate("/home");
  }

  useEffect(() => {
    getUser()
  }, [])
  


  return (
    <>
      <Nav userProfile={userProfile} />
      <Routes>
        <Route path="/" element={<Landing handleClick={handleClick} />} />
        <Route path="/home" element={<Home defaultRelays={defaultRelays} userNpub={userNpub} userHexKey={userHexKey} />} />
        <Route path="/profile" element={<Profile userProfile={userProfile} />} />
        <Route path="/profile/:id" element={<ProfileById />} />
      </Routes>
    </>
  )
}

export default App
