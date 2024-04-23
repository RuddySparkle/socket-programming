import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import defaultAvatar from '../assets/default_groupchat.jpeg';
import axios from 'axios';
import { changeNicknameRoute, createGroupRoute } from '../utils/APIRoutes';
import { toast } from 'react-toastify';
import { IconContext } from 'react-icons';
import { AiTwotoneSetting } from 'react-icons/ai';
import { HiUserGroup } from 'react-icons/hi';
import { BsPlus } from 'react-icons/bs';

export default function Contacts({ contacts, changeChat, socket }) {
    const [currentNickname, setCurrentNickname] = useState(undefined);
    const [currentUsername, setCurrentUsername] = useState(undefined);
    const [currentUserId, setCurrentUserId] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [modalVisible, setModalVisible] = useState(false);
    const [newNickname, setNewNickname] = useState('');
    const [groupname, setGroupname] = useState('');
    const [groupVisible, setGroupVisible] = useState(false);
    const [groupCreationMessage, setGroupCreationMessage] = useState('');

    useEffect(() => {
        async function fetchData() {
            const data = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
            setCurrentUsername(data.username);
            setCurrentNickname(data.nickname);
            setCurrentUserImage(data.avatarImage);
            setCurrentUserId(data._id);
        }
        fetchData();
    }, [currentNickname]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);

        if (contact.email === '') {
            console.log('currentChat', contact, 'Username: ', contact.username);

            // chat with join group
            socket.current.emit('join-room', {
                room: contact.username,
                username: currentUsername,
            });

            // on the socket for roomUsers
            socket.current.on('roomUsers', ({ room, users }) => {
                console.log('roomUsers', room, users);
            });
        } else {
            socket.current.emit('disconnect-room');
        }
    };

    const changeNickname = async (nickname) => {
        try {
            const data = await toast.promise(
                axios.put(`${changeNicknameRoute}/${currentUserId}`, {
                    nickname,
                }),
                {
                    pending: 'Promise is pending',
                    success: 'Promise resolved 👌',
                    error: 'Promise rejected 🤯',
                },
            );
            if (data.status === 200) {
                setCurrentNickname(data.data.nickname);
                localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(data.data));
            }
        } catch (err) {
            console.log(err);
        }
    };
    const createGroup = async (groupname) => {
        try {
            const data = await toast.promise(
                axios.post(`${createGroupRoute}`, {
                    chatName: groupname,
                    users: [currentUserId],
                }),
                {
                    pending: 'Promise is pending',
                    success: 'Promise resolved 👌',
                    error: 'Promise rejected 🤯',
                },
            );
            if (data.status === 200) {
                console.log('Create group successfully');
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Function to open the modal
    const openModal = () => {
        setModalVisible(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setModalVisible(false);
    };

    // Function to submit the new nickname
    const submitNickname = () => {
        if (newNickname.trim() == '') {
            alert('Please enter a nickname!');
            return;
        }
        changeNickname(newNickname);
        closeModal(); // Close the modal after submission
    };
    const submitGroupname = () => {
        if (groupname.trim() === '') {
            alert("Please enter the group's name!");
            return;
        }
        createGroup(groupname);
        setGroupCreationMessage(`Hello Group ${groupname}! Your group has been created.`);
        setGroupname(''); // Clear the input field
        closeGroupModal(); // Close the modal after submission
    };
    
    // Function to open the modal for creating a group
    const openGroupModal = () => {
        setGroupVisible(true);
    };
    
    // Function to close the modal for creating a group
    const closeGroupModal = () => {
        setGroupVisible(false);
    };

    return (
        <>
            {currentUserImage && currentUserImage && (
                <Container>
                    <div className="brand">
                        <h3>เตเต้ทำงานแย้ว!</h3>
                    </div>
                    <div className="contacts">
                        {contacts.map((contact, index) => {
                            return (
                                <div
                                    key={contact._id}
                                    className={`contact ${index === currentSelected ? 'selected' : ''}`}
                                    onClick={() => changeCurrentChat(index, contact)}
                                >
                                    <div className="avatar">
                                        {
                                            // if contact.avatarImage is undefined, use defaultAvatar
                                            contact.avatarImage === undefined ? (
                                                <img src={`${defaultAvatar}`} className="defaultAvatar" alt="" />
                                            ) : (
                                                <img src={`${contact.avatarImage}`} alt="" />
                                            )
                                        }
                                    </div>
                                    <div className="username">
                                        <h3>{contact.nickname}</h3>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="current-user">
                        <div className="avatar">
                            <img src={`${currentUserImage}`} alt="avatar" />
                        </div>
                        <div className="username">
                            <h2>{currentNickname}</h2>
                        </div>
                        <IconContext.Provider
                            value={{
                                color: 'white',
                                className: 'setting-gear',
                                size: '1.5rem',
                            }}
                        >
                            <div className="box" onClick={openGroupModal}>
                                <BsPlus />
                                <HiUserGroup />
                            </div>
                            {groupVisible && (
                            <Modal>
                            <ModalContent>
                                {groupCreationMessage ? (
                                    <p>{groupCreationMessage}</p>
                                ) : (
                                    <>
                                        <p>Please enter the group's name:</p>
                                        <input
                                            type="text"
                                            id="newGroupname"
                                            value={groupname}
                                            onChange={(e) => setGroupname(e.target.value)}
                                        />
                                        <button onClick={submitGroupname}>Create Group</button>
                                        <button className="cancel-button" onClick={closeGroupModal}>Cancel</button>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        )}
                        </IconContext.Provider>
                        <IconContext.Provider
                            value={{
                                color: 'white',
                                className: 'setting-gear',
                                size: '1.5rem',
                            }}
                        >
                            <div className="box" onClick={openModal}>
                                <AiTwotoneSetting />
                            </div>
                            {modalVisible && (
                            <Modal>
                                <ModalContent>
                                    <p>Please enter your new nickname:</p>
                                    <input type="text" id="newNickname" value={newNickname} onChange={(e) => setNewNickname(e.target.value)} />
                                    <button onClick={submitNickname}>Submit</button>
                                    <button className="cancel-button" onClick={closeModal}>Cancel</button>
                                </ModalContent>
                            </Modal>
                        )}
                        </IconContext.Provider>
                    </div>
                </Container>
            )}
        </>
    );
}
const Container = styled.div`
    display: grid;
    grid-template-rows: 10% 75% 15%;
    overflow: hidden;
    background-color: #403129;
    .brand {
      background-color: #221c16;
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 2rem;
        }
        h3 {
            color: white;
            text-transform: uppercase;
        }
    }
    .contacts {
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow: auto;
        gap: 0.8rem;
        padding: 1rem 0;
        &::-webkit-scrollbar {
            width: 0.2rem;
            &-thumb {
                background-color: #eeeeee37;
                width: 0.1rem;
                border-radius: 1rem;
            }
        }
        .contact {
            background-color: #9a7c6260;
            min-height: 5rem;
            cursor: pointer;
            width: 90%;
            border-radius: 0.2rem;
            padding: 0.5rem 1rem;
            display: flex;
            gap: 1rem;
            align-items: center;
            transition: 0.2s ease-in-out;
            &:hover {
              background-color: #9a7c62;
              cursor: pointer;
            }
            .avatar {
                img {
                    height: 3rem;
                }
                .defaultAvatar {
                    border-radius: 50%;
                }
            }
            .username {
                h3 {
                    color: white;
                }
            }
        }
        .selected {
            background-color: #9a7c62;
        }
    }

    .current-user {
        background-color: #221c16;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        .avatar {
            img {
                height: 3rem;
                max-inline-size: 100%;
            }
        }

        .username {
            h2 {
                color: white;
            }
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) {
            gap: 0.5rem;
            .username {
                h2 {
                    font-size: 1rem;
                }
            }
        }
        .box {
          cursor: pointer;
          padding: 0.3rem;
          border-radius: 0.2rem;
          transition: 0.2s;
          &:hover {
            background-color: #c1ad9d;
          }
        }
    }
    /* Close button style */
    .close {
        color: #aaa;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        position: absolute;
        top: 10px;
        right: 20px;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
    }

    input[type="text"] {
        padding: 10px;
        width: 80%;
        margin-bottom: 20px;
        border-radius: 5px;
        border: 1px solid #ccc;
        font-size: 16px;
    }

    button {
        padding: 10px 20px;
        border: none;
        background-color: #4caf50;
        color: white;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
        font-size: 16px;
        margin: 0 10px;
    }

    button:hover {
        background-color: #45a049;
    }

    .cancel-button {
        background-color: #f44336;
    }

    .cancel-button:hover {
        background-color: #d32f2f;
    }
`;


const Modal = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.4);
`;

const ModalContent = styled.div`
    background-color: #fca300;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    text-align: center;
    width: 350px;
`;
