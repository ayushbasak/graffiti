import { Flex, Grid, MantineProvider, Switch, Text } from '@mantine/core';
import './App.css'

import { themeStore } from './store/store';
import { userStore } from './store/store';
import { Link, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import UploadPost from './components/UploadPost';
import Profile from './components/Profile';
import Shop from './components/Shop';
import { useEffect } from 'react';
import refresh_token from './middlewares/refresh';
import getUserInfo from './middlewares/getUserInfo';
import Footer from './components/Footer';
import { Toaster } from 'sonner';
function App() {
  const theme = themeStore(state => state.theme);
  const useTokens = userStore(state => state.useTokens);
  const setName = userStore(state => state.setName);
  const setUserId = userStore(state => state.setUserId);
  const setUserGc = userStore(state => state.setUserGc);
  const setUserInvite = userStore(state => state.setUserInvite);
  const setBanned = userStore(state => state.setBanned);
  const toggleAuth = userStore(state => state.toggleAuth);
  const authenticated = userStore(state => state.authenticated);

  useEffect(() => {
    // Helper to get cookie by name
    const getCookie = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
      return null;
    };

    // Grab BOTH the refresh_token and username from the cookies!
    const token = getCookie('refresh_token');
    const cookieUserName = getCookie('username');

    if (token) {
      if (cookieUserName) {
        // Optimistic login to prevent flashing a "logged out" UI
        setName(cookieUserName);
        toggleAuth(true);
      }

      refresh_token()
        .then((tokens) => {
          useTokens(tokens.access_token, tokens.refresh_token);
          return tokens;
        })
        .then((tokens) => {
          const userInfo = getUserInfo(tokens.access_token);
          return userInfo;
        })
        .then((userInfo) => {
          setName(userInfo.username);
          setUserId(userInfo._id);
          setUserGc(userInfo.gc);
          setUserInvite(userInfo.invite);
          setBanned(userInfo.access_level < 0);
          toggleAuth(true); // Final confirmation
        })
        .catch((error) => {
          // If the refresh token is expired/invalid, clear it from zustand
          toggleAuth(false);
          useTokens("", "");
        });
    }
  }, []) // Empty dependency array means this runs ONLY ONCE when App loads

  return (
    <>
      <Toaster position="top-center" richColors />
      <MantineProvider theme={{ colorScheme: theme }}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 w-full bg-slate-50 dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 xl:w-[1240px] xl:mx-auto">
            <Routes>
              <Route path='/' element={<Home />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/signup' element={<Signup />}></Route>
              <Route path='/upload' element={<UploadPost />}></Route>
              <Route path='/profile/:username' element={<Profile />}></Route>
              <Route path='/shop' element={<Shop />}></Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </MantineProvider>
    </>
  )
}

export default App


// {
//   <Switch onChange={() => toggle()}/>
//       {/* <Signup /> */}
//       <Navbar />
//         <Routes>
//           <Route path='/login' element={<Login />}></Route>
//         </Routes>
//       {
//         authenticated &&
//         <Display />
//       }
// }