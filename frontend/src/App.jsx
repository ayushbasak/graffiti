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
import { useEffect } from 'react';
import refresh_token from './middlewares/refresh';
import getUserInfo from './middlewares/getUserInfo';
import Footer from './components/Footer';
import { Notifications } from '@mantine/notifications';
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
    const token = window.localStorage.getItem('refresh_token');
    if (token) {
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
        toggleAuth(true);
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [])
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: theme }}>
        <Notifications  position='top-left'/>
          <Navbar />
          <Flex
            sx={{
              height: '85%',
              width: '100%',
              justifyContent: 'center',
              // alignItems: 'center',
            }}
          >
            <Routes>
              <Route path='/' element={<Home />}></Route>
              <Route path='/login' element={<Login />}></Route>
              <Route path='/signup' element={<Signup />}></Route>
              <Route path='/upload' element={<UploadPost />}></Route>
              <Route path='/profile' element={<Profile />}></Route>
            </Routes>
          </Flex>
          <Footer />
    </MantineProvider>
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