import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Robot from '../assets/robot.gif';
import Logout from './Logout';

export default function Welcome({ socket }) {
    const [userName, setUserName] = useState('');
    useEffect(() => {
        async function refetchData() {
            setUserName(await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)).username);
            await socket.current.emit('disconnect-room');
        }
        refetchData();
    }, [socket]);
    return (
        <Container>
            {/* <img src={Robot} alt="" /> */}
            <h1>
                Welcome, <span>{userName}!</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
            <br />
            <h2>
              Don't wanna chat right now?
            </h2>
            <div className="chat-header">
                <Logout />
            </div>
        </Container>
    );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  } 
  h1, h3 {
    color: #5e483c;
    font-weight: 500;
  }
  h2 {
    color: #403429;
    font-weight: 500;
  }
  span {
    color: #403129;
    font-weight: 700;
  }
  .chat-header {
    padding: 0.5rem;
  }
`;
