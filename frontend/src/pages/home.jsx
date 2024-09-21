import React from "react";
import { IconButton } from "@mui/material";
import StartIcon from '@mui/icons-material/Start';

import "../styles/Home.css";

export default function Home() {
    return (
        <>
            <div className='home'>
                <h1>Unemployment Simulator</h1>
                <IconButton size="large" color='primary' style={{ background: 'white', borderRadius: '100%' }}>
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