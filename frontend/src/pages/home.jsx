import React, {useState} from "react";
import { IconButton } from "@mui/material";
import StartIcon from '@mui/icons-material/Start';
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Instructions from "./instructions"; // Import the modal

import "../styles/Home.css";

export default function Home() {
    const items = new Array(100).fill(0); // Create an array to generate the items
    const items2 = new Array(100).fill(0); // Create an array to generate the items
    const navigate = useNavigate();

    useEffect(() => {
        window.localStorage.clear();
    }, []);

    const [showModal, setShowModal] = useState(false);

    const handleBeginClick = () => {
        setShowModal(true); // Show the instructions modal when the button is clicked
    };

    const handleContinue = () => {
        setShowModal(false); // Close the modal
        navigate('/setup'); // Navigate to the setup page
    };

    return (
        <>
            <div className='home'>

                <div className="slogan">
                    The AI Job Interview Simulator
                </div>

                <div className="login-container">
                    <span className="login-text">HireHigher</span>
                </div>


                {/* Begin button shows the modal */}
                <IconButton size="large" color='primary' style={{
                    background: 'white',
                    borderRadius: '100%',
                    width: '100px',
                    height: '100px',
                    fontSize: '50px',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.3)',
                    marginTop: '50px'
                }} onClick={handleBeginClick}>
                    <StartIcon/>
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

                {/* Modal that shows the instructions */}
                <Instructions
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    onContinue={handleContinue}
                />

            </div>
        </>
    );
}