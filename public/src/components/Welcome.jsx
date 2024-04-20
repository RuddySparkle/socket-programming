import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Robot from '../assets/robot.gif';
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
            <img src={Robot} alt="" />
            <h1>
                Welcome, <span>{userName}!</span>
            </h1>
            <h3>Please select a chat to Start messaging.</h3>
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
  h1 {
    color: #5e483c;
    font-weight: 500;
  }
  h3 {
    color: #5e483c;
    font-weight: 500;
  }
  span {
    color: #403129;
    font-weight: 700;
  }
`;
