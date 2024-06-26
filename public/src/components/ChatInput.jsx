import React, { useState } from 'react';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import formatMessage from '../utils/messages';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons/faPaperPlane';
import CustomIcon from './CustomIcon';

export default function ChatInput({ handleSendMsg, username }) {
    const [msg, setMsg] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    // const handleEmojiPickerhideShow = () => {
    //     setShowEmojiPicker(!showEmojiPicker);
    // };

    // const handleEmojiClick = (event, emojiObject) => {
    //     let message = msg;
    //     message.text += emojiObject.emoji;
    //     setMsg(message);
    // };

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg(formatMessage(username, msg));
            setMsg('');
        }
    };

    return (
        <Container>
            <div className="button-container">
                {/* <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
          {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
        </div> */}
            </div>
            <form className="input-container" onSubmit={(event) => sendChat(event)}>
                <input
                    type="text"
                    placeholder="type your message here"
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                />
                <button type="submit">
                    <CustomIcon
                        size="sm"
                        onClickHandler={(e) => {
                            sendChat(e);
                        }}
                        faIcon={faPaperPlane}
                        colorNormal="white"
                        colorHover="#fca300"
                    />
                </button>
            </form>
        </Container>
    );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #272019;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    grid-template-columns: 5% 95%;
    background-color: #080420;
    padding: 0 2rem;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0 1rem;
        gap: 1rem;
    }
    .button-container {
        display: flex;
        align-items: center;
        color: white;
        gap: 1rem;
        .emoji {
            position: relative;
            svg {
                font-size: 1.5rem;
                color: #ffff00c8;
                cursor: pointer;
            }
            .emoji-picker-react {
                position: absolute;
                top: -350px;
                background-color: #080420;
                box-shadow: 0 5px 10px #9a86f3;
                border-color: #9a86f3;
                .emoji-scroll-wrapper::-webkit-scrollbar {
                    background-color: #080420;
                    width: 5px;
                    &-thumb {
                        background-color: #9a86f3;
                    }
                }
                .emoji-categories {
                    button {
                        filter: contrast(0);
                    }
                }
                .emoji-search {
                    background-color: transparent;
                    border-color: #9a86f3;
                }
                .emoji-group:before {
                    background-color: #080420;
                }
            }
        }
    }
  }
  .input-container {
    width: 100%;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff40;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;

      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 1rem;
      border-radius: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #fca300;
      border: none;
      transition: 0.2s;
      gap: 0.4rem;
      color: white;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      &:hover {
        cursor: pointer;
        background-color: #e97603;
      }
      svg {
        font-size: 2rem;
        padding: 0.5rem;
        color: white;
      }
    }
`;
