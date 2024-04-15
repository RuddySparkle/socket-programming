import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { useOktaAuth, Security } from '@okta/okta-react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './auth';
import './App.css';
import OktaAuth from '@okta/okta-auth-js';

const ChatApp = () => {
  const [socket, setSocket] = useState(null);
  const { oktaAuth, authState } = useOktaAuth();
  const [user, token] = useAuth();

  const login = async () => oktaAuth.signInWithRedirect('/');
  const logout = async () => oktaAuth.signOut('/');

  useEffect(() => {
    const newSocket = io(
      `http://${window.location.hostname}:3000`,
      token && { query: { token } }
    );
    setSocket(newSocket);
    return () => newSocket.close();
  }, [token]);

  console.log(oktaAuth, authState);

  return (
    <div className="App">
      <header className="app-header">
        {!authState ? (
          <div>Loading...</div>
        ) : user ? (
          <div>
            <div>Signed in as {user.name}</div>
            <button onClick={logout}>Sign out</button>
          </div>
        ) : (
          <div>
            <div>Not signed in</div>
            <button onClick={login}>Sign in</button>
          </div>
        )}
      </header>
      {socket ? (
        <div className="chat-container">
          <Messages socket={socket} />
          <MessageInput socket={socket} />
        </div>
      ) : (
        <div>Not Connected</div>
      )}
    </div>
  );
};

function App() {
  const oktaConfig = new OktaAuth({
    issuer: `${process.env.REACT_APP_OKTA_ORG_URL}/oauth2/default`,
    clientId: process.env.REACT_APP_OKTA_CLIENT_ID,
    redirectUri: window.location.origin + '/login/callback',
  });
  console.log('Okta Config:', oktaConfig);

  return (
    <Router>
      <Security oktaAuth={oktaConfig} restoreOriginalUri={true}>
        <ChatApp />
      </Security>
    </Router>
  );
}

export default App;
