import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import Logout from './Logout';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import {
    sendMessageRoute,
    recieveMessageRoute,
    sendGroupMessageRoute,
    recieveGroupMessageRoute,
    editMessageRoute,
} from '../utils/APIRoutes';
import defaultAvatar from '../assets/default_groupchat.jpeg';
import { useNavigate } from 'react-router-dom';

export default function ChatContainer({ currentChat, socket }) {
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)),
    );
    const scrollRef = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
                navigate('/login');
            } else {
                setCurrentUser(await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)));
            }
        }
        fetchData();
    }, [navigate]);

    useEffect(() => {
        async function fetchData() {
            const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
            if (currentChat.email !== '') {
                console.log('from', data._id, 'to', currentChat._id);
                const response = await axios.post(recieveMessageRoute, {
                    from: data._id,
                    to: currentChat._id,
                });
                console.log(response);

                setMessages(response.data);
            } else {
                console.log('chatname', currentChat.username);
                const response = await axios.post(`${recieveGroupMessageRoute}`, {
                    chatName: currentChat.username,
                    user: data._id,
                });
                console.log(response);
                setMessages(response.data);
            }
        }
        fetchData();
    }, [currentChat, currentUser._id]);

    const editMessageHandler = async (message) => {
        // add window alert to edit message
        console.log(message);
        if (message.fromSelf) {
            const newMessage = prompt('Edit your message', message.message.text);
            if (newMessage === null) {
                return;
            }
            if (newMessage) {
                console.log('Edit message', newMessage);
                console.log('message', message, 'message id', message._id);
                // update message in the database
                // convert time to mongeDB format

                const response = await axios.put(`${editMessageRoute}`, {
                    messageId: message._id,
                    message: newMessage,
                });
                console.log(response);
                if (response.status === 200) {
                    const msgs = [...messages];
                    msgs[messages.indexOf(message)].message.text = newMessage;
                    // set classnames for css to edit message
                    msgs[messages.indexOf(message)].className += ' edited';
                    setMessages(msgs);
                    console.log(msgs);
                    return true;
                } else {
                    alert('Failed to edit message');
                }
            }
        }
        return false;
    };

    useEffect(() => {
        const getCurrentChat = async () => {
            if (currentChat) {
                await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY))._id;
            }
        };
        getCurrentChat();
    }, [currentChat]);

    const handleSendMsg = async (msg) => {
        const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        if (currentChat.email !== '') {
            socket.current.emit('send-msg', {
                to: currentChat._id,
                from: data._id,
                msg: msg.text,
                username: data.username,
            });
            const res = await axios.post(sendMessageRoute, {
                from: data._id,
                to: currentChat._id,
                message: msg.text,
                time: msg.time,
                username: data.username,
            });
            // set msgs id
            msg.id = res.data.id;
        } else {
            socket.current.emit('send-group-message', msg.text);
            console.log('chatname', currentChat.username);
            const res = await axios.post(sendGroupMessageRoute, {
                chatName: currentChat.username,
                message: msg.text,
                sender: data._id,
                time: msg.time,
                username: data.username,
            });
            // set msgs id
            msg.id = res.data.id;
        }
        const msgs = [...messages];
        msgs.push({ fromSelf: true, message: msg });
        setMessages(msgs);
        console.log(msgs);
    };

    useEffect(() => {
        socket.current.on('msg-recieve', (msg) => {
            setArrivalMessage({ fromSelf: false, message: msg });
        });
    }, [socket]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <div className="avatar">
                        {currentChat.avatarImage !== undefined ? (
                            <img src={`${currentChat.avatarImage}`} alt="" />
                        ) : (
                            <img src={`${defaultAvatar}`} alt="" />
                        )}
                    </div>
                    <div className="username">
                        <h3>{currentChat.username}</h3>
                    </div>
                </div>
                <Logout />
            </div>
            <div className="chat-messages">
                {messages.map((message) => {
                    return (
                        <div ref={scrollRef} key={uuidv4()}>
                            <div
                                className={`message ${message.fromSelf ? 'sended' : 'recieved'} ${message.edited ? 'edited' : ''}`}
                                onClick={() => {
                                    editMessageHandler(message);
                                }}
                            >
                                <div className="content ">
                                    <p>
                                        ({message.message.username}){message.message.time}
                                    </p>
                                    <br />
                                    <p>{message.message.text}</p>
                                    {message.edited && <p className="editedLabel">(edited)</p>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ChatInput handleSendMsg={handleSendMsg} username={currentUser.username} />
        </Container>
    );
}

const Container = styled.div`
display: grid;
grid-template-rows: 12% 75% 13%;
gap: 0.1rem;
overflow: hidden;
border-radius: 0.2rem;
@media screen and (min-width: 720px) and (max-width: 1080px) {
  grid-template-rows: 15% 70% 1=6%;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background-color: #4d814a;
  .user-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    .avatar {
      img {
        height: 3rem;
      }
    }
    .username {
      h3 {
        color: white;
      }
    }
  }
}
.chat-messages {
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
    &-thumb {
      background-color: #ffffff39;
      width: 0.1rem;
      border-radius: 1rem;
    }
  }
  .message {
    display: flex;
    align-items: center;
    .content {
      max-width: 100%;
      overflow-wrap: break-word;
      padding: 1rem;
      font-size: 1.1rem;
      border-radius: 1rem;
      color: #403129;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        max-width: 70%;
      }
      
    }
  }
  .sended {
    justify-content: flex-end;
    .content {
      background-color: #d9e8d8;
    }
  }
  .sended:hover {
    cursor: pointer;
    .content {
      background-color: #D1DFD0;
    }
  }
  .editedLabel {
    color: #aeb4ad;
    font-size: 0.8rem;
  }
  .recieved {
    justify-content: flex-start;
    .content {
      background-color: #9900ff;
    }
`;
