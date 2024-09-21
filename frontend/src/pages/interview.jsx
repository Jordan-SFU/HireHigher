import React, { useRef, useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import '../styles/Interview.css';
import { useNavigate } from 'react-router-dom';

const Interview = () => {
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [recordings, setRecordings] = useState({});
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const steps = Array.from({ length: 10 }, (_, i) => `Question ${i + 1}`);
    const [isDone, setIsDone] = useState(false);

    // Start the video feed
    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            streamRef.current = stream;

            // Ensure video plays only after the metadata is loaded
            videoRef.current.addEventListener('loadedmetadata', () => {
                videoRef.current.play();
            });
        } catch (err) {
            console.error('Error accessing webcam: ', err);
        }
    };

    // Start audio recording
    const startRecording = async () => {
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(audioStream);
        mediaRecorderRef.current.ondataavailable = event => {
            chunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
            chunksRef.current = [];

            // Save the recording for the current question
            setRecordings(prevRecordings => ({
                ...prevRecordings,
                [currentQuestion]: blob
            }));
        };
        mediaRecorderRef.current.start();
    };

    // Stop audio recording
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    // Move to the next question and handle recording transitions
    const nextQuestion = () => {
        stopRecording(); // Stop recording for the current question

        // Check if the interview is done
        if (currentQuestion < 9) {
            setCurrentQuestion(prev => prev + 1); // Move to the next question
        } else {
            setIsDone(true);
            navigate('/results');
        }
    };

    // Start a new recording whenever the question changes
    useEffect(() => {
        if (currentQuestion <= 9) {
            startRecording(); // Start recording the new question
        }
    }, [currentQuestion]);

    useEffect(() => {
        // Start the video automatically on component mount
        startVideo();
        startRecording(); // Start the first question recording immediately

        return () => {
            // Cleanup video and stop any ongoing media streams
            if (streamRef.current) {
                const tracks = streamRef.current.getTracks();
                tracks.forEach(track => track.stop());
            }
            stopRecording();
        };
    }, []);

    const playbackScreen = () => {
        const recordingsArray = Object.values(recordings);
        window.localStorage.setItem('recordings', JSON.stringify(recordingsArray));
        
        // display all recordings to current screen

        return (
            <div>
                <h1>Interview Playback</h1>
                <div>
                    {recordingsArray.map((recording, index) => (
                        <audio key={index} controls src={URL.createObjectURL(recording)} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="interview-container">
            {/* Header */}
            <div className="header">
                <h1>Interview</h1>
            </div>

            {/* Video Feeds */}
            <div className="video-section">
                <div className="video-feed" id="user-video">
                    <video ref={videoRef} className="video-element" />
                    <div className="name-tag">You</div>
                </div>
                <div className="video-feed" id="interviewer-video">
                    <div className="black-screen" /> {/* This is the interviewer cam */}
                    <div className="name-tag">Interviewer</div>
                </div>
            </div>

            {/* Question Stepper */}
            <div className="stepper-section">
                <Stepper activeStep={currentQuestion} alternativeLabel>
                    {steps.map((label, index) => (
                        <Step key={index}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Button
                    className="control-btn"
                    onClick={nextQuestion}
                >
                    {currentQuestion < 9 ? 'Next Question' : 'Finish Interview'}
                </Button>
            </div>

            {/* Playback Screen */}
            {isDone && playbackScreen()}
        </div>
    );
};

export default Interview;
