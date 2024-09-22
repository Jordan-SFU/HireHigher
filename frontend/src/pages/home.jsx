import React from "react";
import { IconButton } from "@mui/material";
import StartIcon from '@mui/icons-material/Start';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import "../styles/Home.css";

export default function Home() {
    const items = new Array(100).fill(0); // Create an array to generate the items
    const items2 = new Array(100).fill(0); // Create an array to generate the items
    const navigate = useNavigate();

    useEffect(() => {
        window.localStorage.clear();
    }, []);

    return (
        <>
            <div className='home'>
                <div className="login-container">
                    <span className="login-text">HireHigher</span>
                </div>


                <IconButton size="large" color='primary' style={{background: 'white', borderRadius: '100%', width: '100px',    // Increase the width
                    height: '100px',   // Increase the height
                    fontSize: '50px',   // Increase the icon size
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)', // Add drop shadow
                    marginTop: '50px'  // Move the button down
                         }} onClick={() => {navigate('/setup')}}>
                    <StartIcon />
                </IconButton>
                <h3>BEGIN</h3>

                {/* Infinite vertical carousel */}
                <div className="carousel-container">
                    <div className="carousel">
                        {items.map((_, index) => (
                            <div key={index} className="carousel-item">
                                <div className="image-animation"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Infinite vertical carousel */}
                <div className="carousel-container2">
                    <div className="carousel2">
                        {items2.map((_, index) => (
                            <div key={index} className="carousel-item">
                                <div className="image-animation2"></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="authors">
                    <p>Jordan McKenzie, Nicholas Chan, Riley Su, Bjorn Flamminman</p>
                </div>
            </div>
        </>
    );
}