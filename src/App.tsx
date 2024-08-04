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

  const navigate = useNavigate()

  const defaultRelays = [
    "wss://relay.nostr.band",
    "wss://relay.damus.io",
    "wss://nos.lol",
    "wss://relay.snort.social"
  ]

  const ndk = new NDK({
    explicitRelayUrls: defaultRelays,
    autoConnectUserRelays: false,
    autoFetchUserMutelist: false,
    signer: new NDKNip07Signer
  })

  const signer = new NDKNip07Signer()
  ndk.signer = signer

  const handleClick = async () => {
    const user = await signer.user();
    let profile = await user.fetchProfile()

    setUserProfile(profile as UserProfile | any);

    if (!!user.npub) {
      setUserNpub(user.npub);
      setUserHexKey(user.pubkey);
    }
    navigate("/home");
  }

  const handleLogout = () => {
    setUserNpub('')
    const ndk = null
    return navigate("/")
  }

  useEffect(() => {
    ndk.connect()
  }, [ndk])

  return (
    <>
      <Nav userProfile={userProfile} userHexKey={userHexKey} userNpub={userNpub} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Landing handleClick={handleClick} />} />
        <Route path="/home" element={<Home ndk={ndk} userNpub={userNpub} userHexKey={userHexKey} />} />
        <Route path="/profile" element={<Profile userProfile={userProfile} />} />
        <Route path="/profile/:id" element={<ProfileById ndk={ndk} />} />
      </Routes>
    </>
  )
}

export default App
