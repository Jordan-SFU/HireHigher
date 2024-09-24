// http://http://127.0.0.1:8000 highlight to replace

import React from 'react';
import '../styles/Instructions.css'; // Import your modal styles

export default function Instructions({ show, onClose, onContinue }) {
    if (!show) {
        return null; // Don't render if the modal isn't supposed to be shown
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h1>INSTRUCTIONS</h1>
                <p>
                    1. Begin by deciding what job title you will apply for, and then upload your resume and
                    other information.
                    <br/><br/>
                    2. The AI interviewer will ask you a series of questions related to the job you're applying for.
                    <br/><br/>
                    3. Use your microphone to answer each question verbally. The AI will analyze your answers in
                    real-time.
                    <br/><br/>
                    4. After several rounds of questions and answers, you'll be judged for employment.
                </p>
                <div className="modal-buttons">
                    <button className="close-button" onClick={onClose}>
                        Close
                    </button>
                    <button className="continue-button" onClick={onContinue}>
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}

