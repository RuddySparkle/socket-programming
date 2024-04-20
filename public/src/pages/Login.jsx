import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loginRoute } from '../utils/APIRoutes';

export default function Login() {
    const navigate = useNavigate();
    const [values, setValues] = useState({ username: '', password: '' });
    const toastOptions = {
        position: 'top-center',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: false,
        theme: 'light',
    };

    useEffect(() => {
        if (localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            navigate('/');
        }
    }, [navigate]);

    const handleChange = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const validateForm = () => {
        const { username, password } = values;
        if (username === '') {
            toast.error('Email and Password is required.', toastOptions);
            return false;
        } else if (password === '') {
            toast.error('Email and Password is required.', toastOptions);
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validateForm()) {
            const { username, password } = values;
            const { data } = await axios.post(loginRoute, {
                username,
                password,
            });
            if (data.status === false) {
                toast.error(data.msg, toastOptions);
            }
            if (data.status === true) {
                localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY, JSON.stringify(data.user));

                navigate('/');
            }
        }
    };

    return (
        <>
            <FormContainer>
                <form action="" onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <h1>เตเต้มาเรียนบ้าง!</h1>
                    </div>
                    <input
                        type="text"
                        placeholder="Username"
                        name="username"
                        onChange={(e) => handleChange(e)}
                        min="3"
                    />
                    <input type="password" placeholder="Password" name="password" onChange={(e) => handleChange(e)} />
                    <button type="submit">Log In</button>
                    <span>
                        Don't have an account ? <Link to="/register">Register Now</Link>
                    </span>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    );
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background-color: #e3eee2;
    .brand {
        display: flex;
        align-items: center;
        gap: 1rem;
        justify-content: center;
        img {
            height: 5rem;
        }
        h1 {
            color: white;
            text-transform: uppercase;
            font-weight: 600;
            color: #403129;
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        background-color: #9cc599;
        border-radius: 0.5rem;
        padding: 5rem;
        border: 3px solid #403129;
        box-shadow: 0px 0px 30px 5px #403129;
    }
    input {
        background-color: #bad6b8;
        padding-left: 1rem;
        padding-top: 0.75rem;
        padding-bottom: 0.75rem;
        border: 2px solid #403129;
        border-radius: 0.2rem;
        box-shadow: 1.5px 1.5px #403129;
        color: #403129;
        width: 100%;
        font-size: 1rem;
        font-weight: 600;
        transition: 0.2s;
        &:hover {
            background-color: #cee2cd;
            outline: none;
        }
        &:focus {
            background-color: #cee2cd;
            outline: none;
        }
    }
    button {
        background-color: #7c5f4f;
        color: whitesmoke;
        padding: 0.75rem 2rem;
        border: 2px solid #403129;
        box-shadow: 1.5px 1.5px #403129;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.2s;
        &:hover {
            background-color: #5e483c;
        }
    }
    span {
        color: #403129;
        font-weight: 500;
        a {
            color: #5e483c;
            text-transform: uppercase;
            font-weight: 700;
            transition: 0.2s;
            &:hover {
                color: #9a7662;
            }
        }
    }
`;
