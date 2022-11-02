import './App.css'
import React, { useState } from 'react';
import axios from 'axios';
function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  function username_handler(e: React.ChangeEvent<HTMLInputElement>) {
    setUsername(e.target.value);
  }


  function password_handler(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }


  const API = import.meta.env.VITE_BACKEND_API;

  async function login() {
    const LOGIN_API = API + 'auth/login';
    const data = {
      username,
      password
    }

    try {
      const result = await axios.post(LOGIN_API, data);
      alert('logged in ');
      setToken(result.data.access_token);
    }
    catch (err) {
      setToken('')
      alert(err);
      console.log(err);
    }
  }

  async function logout() {
    if (token) {
      setToken('')
      alert('logged out');
    }
    else {
      alert('already logged out');
    }
  }

  async function getUsername() {
    const config = {
      headers: { Authorization: `Bearer ${token}`}  
    }

    try {
      const result = await axios.get(API + 'iq', config);
      alert(result.data);
      console.log(result.data);
    }
    catch (err) {
      alert(err);
      console.log(err);
    }
  }
  return (
    <div>
      <p>username</p>
      <input type="text" onChange={username_handler}/>
      <p>password</p>
      <input type="password" onChange={password_handler}/>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
      <button onClick={getUsername}>Get Username</button>
      Hello World
    </div>
  )
}

export default App
