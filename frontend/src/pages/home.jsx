import React from "react";
import { IconButton } from "@mui/material";
import StartIcon from '@mui/icons-material/Start';
import { useNavigate } from "react-router-dom";

import "../styles/Home.css";

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <div className='home'>
                <h1>Unemployment Simulator</h1>
                <IconButton size="large" color='primary' style={{ background: 'white', borderRadius: '100%' }} onClick={() => {navigate('/chattest')}}>
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