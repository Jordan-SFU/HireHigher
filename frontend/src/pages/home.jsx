import React, { useState } from "react";
import { IconButton } from "@mui/material";
import StartIcon from '@mui/icons-material/Start';
import { useNavigate } from "react-router-dom";

import "../styles/Home.css";

export default function Home() {
    const navigate = useNavigate();
    const [animate, setAnimate] = useState(false);

    const handleStartClick = () => {
        setAnimate(true);
        setTimeout(() => {
            navigate('/setup'); // Wait for the animation to finish before navigating
        }, 1000); // The timeout should match the animation duration
    };

    return (
        <>
            <div className={`home ${animate ? 'hide-content' : ''}`}>
                <h1>Unemployment Simulator</h1>
                <IconButton size="large" color='primary' style={{ background: 'white', borderRadius: '100%' }} onClick={handleStartClick}>
                    <StartIcon />
                </IconButton>
                <h3>Get Started</h3>
                <div className="authors">
                    <p>Jordan McKenzie, Nicholas Chan, Riley Su, Bjorn Flamminman</p>
                </div>
            </div>
            {/* This is the animated box */}
            <div className={`cover-screen ${animate ? 'animate' : ''}`}></div>
        </>
    );
}
