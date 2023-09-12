import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import './Home.css';
import socket from './../../services/socket';

function Home() {
  const navigate = useNavigate()

  const [ isLoading, setIsLoading ] = useState(true)

  const token = localStorage.getItem('token')
  let auth;

  socket.emit('loginWithToken', { token }, d => {
    if (d.err) {
      console.log('Invalid Auth')
      navigate('/login')
    } else {
      auth = token;
    }
  })

  return (
    <div className={"container home" + (isLoading ? " disableScroll" : "")}>
      { isLoading ? (
        <div className="appLoadingScreen">
          <div className="spinningDisk"></div>
        </div>
      ) : (
        <div className="content">
          <h1>Home</h1>
          <p>Bem-vindo ao HyteSpace!</p>
        </div>
      ) }
    </div>
  );
}

export default Home;
