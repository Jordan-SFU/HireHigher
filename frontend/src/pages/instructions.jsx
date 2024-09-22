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
                    Welcome to the job interview simulator! Here's how it works:
                    <br/><br/>
                    1. You will begin by deciding what Job Title you will apply for, and then upload your resume and other information.
                    <br/>
                    2. The AI interviewer will ask you a series of questions related to the job you're applying for.
                    <br/>
                    3. Use your microphone to answer each question verbally. The AI will analyze your answers in real-time.
                    <br/>
                    4. After 5 rounds of questions and answers, you'll receive feedback on your performance.
                    <br/><br/>
                    Make sure you're in a quiet environment for the best experience.
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


// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import "../styles/Instructions.css";
//
// export default function Instructions() {
//     const navigate = useNavigate();
//
//     return (
//         <div className="instructions-container">
//             <h1>How to Play the Simulator</h1>
//             <p>
//                 Welcome to the job interview simulator! Here's how it works:
//                 <br/><br/>
//                 1. You will begin by deciding what Job Title you will apply for, and then upload your resume and other information.
//                 <br/>
//                 2. The AI interviewer will ask you a series of questions related to the job you're applying for.
//                 <br/>
//                 3. Use your microphone to answer each question verbally. The AI will analyze your answers in real-time.
//                 <br/>
//                 4. After 5 rounds of questions and answers, you'll receive feedback on your performance.
//                 <br/><br/>
//                 Make sure you're in a quiet environment for the best experience.
//             </p>
//
//             {/* Continue Button */}
//             <button className="continue-button" onClick={() => navigate('/setup')}>
//                 Continue
//             </button>
//         </div>
//     );
// }
