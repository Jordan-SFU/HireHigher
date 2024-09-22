import React from "react";
import { IconButton } from "@mui/material";
import StartIcon from '@mui/icons-material/Start';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "../styles/Home.css";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        window.localStorage.clear();
    }, []);

    return (
        <>
            <div className='home'>
                <h1 className="login-text">HireHigher</h1>
                <IconButton size="large" color='primary' style={{ background: 'white', borderRadius: '100%' }} onClick={() => {navigate('/setup')}}>
                    <StartIcon />
                </IconButton>
                <h3>Get Started</h3>
                <div className="authors">
                    <p>Jordan McKenzie, Nicholas Chan, Riley Su, Bjorn Flamminman</p>
                </div>
            </div>
        </>
    );
}