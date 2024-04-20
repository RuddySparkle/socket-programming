import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import { allUsersRoute, allGroupsRoute, host } from '../utils/APIRoutes';
import ChatContainer from '../components/ChatContainer';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';

export default function Chat() {
    const navigate = useNavigate();
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);
    const localhostKey = localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY);

    useEffect(() => {
        async function fetchData() {
            if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
                navigate('/login');
            } else {
                setCurrentUser(await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)));
            }
        }
        fetchData();
    }, [localhostKey, navigate]);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit('add-user', currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        async function fetchData() {
            if (currentUser) {
                if (currentUser.isAvatarImageSet) {
                    const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                    setContacts(data.data);

                    // fetch group chats
                    const group = await axios.get(`${allGroupsRoute}/${currentUser._id}`);
                    group.data.map((g) => {
                        const groupformat = {
                            avatarImage: undefined,
                            email: '',
                            username: '',
                            nickname: '',
                            _id: '',
                        };
                        groupformat.username = g.name;
                        groupformat.nickname = g.name;
                        groupformat._id = g._id;
                        setContacts((prev) => [...prev, groupformat]);
                        return groupformat;
                    });
                } else {
                    navigate('/setAvatar');
                }
            }
        }
        fetchData();
    }, [currentUser, navigate]);
    const handleChatChange = (chat) => {
        setCurrentChat(chat);
    };
    return (
        <>
            <Container>
                <div className="container">
                    <Contacts contacts={contacts} changeChat={handleChatChange} socket={socket} />
                    {currentChat === undefined ? (
                        <Welcome socket={socket} />
                    ) : (
                        <ChatContainer currentChat={currentChat} socket={socket} />
                    )}
                </div>
            </Container>
        </>
    );
}

const Container = styled.div`
<<<<<<< Updated upstream
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #131324;
    .container {
        height: 85vh;
        width: 85vw;
        background-color: #00000076;
        display: grid;
        grid-template-columns: 25% 75%;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            grid-template-columns: 35% 65%;
        }
=======
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #E3EEE2;
  .container {
    height: 85vh;
    width: 85vw;
    border: 3px solid #403129;
    border-radius: 0.5rem;
    box-shadow: 0px 0px 30px 5px #403129;
    background-color: #9CC599;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
>>>>>>> Stashed changes
    }
`;
