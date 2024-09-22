import React, { useRef, useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import '../styles/Interview.css';
import { useNavigate } from 'react-router-dom';

const Interview = () => {
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [transcriptions, setTranscriptions] = useState({});
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const recognitionRef = useRef(null); // Reference for the speech recognition instance
    const steps = Array.from({ length: 10 }, (_, i) => `Question ${i + 1}`);
    const [isDone, setIsDone] = useState(false);

    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        // get summary and questions from local storage
        const summary = window.localStorage.getItem('summary');
        const questions = window.localStorage.getItem('questions');

        // clear local storage
        window.localStorage.removeItem('summary');
        window.localStorage.removeItem('questions');

        // set questions
        setQuestions(questions);
    }, []);

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

    // Initialize and start speech recognition
    const startSpeechRecognition = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error('SpeechRecognition API not supported in this browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US'; // Set the desired language

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            console.log('Transcript:', transcript);

            // Save the transcription for the current question
            setTranscriptions(prevTranscriptions => ({
                ...prevTranscriptions,
                [currentQuestion]: transcript
            }));
        };

        recognition.onerror = (event) => {
            console.error('SpeechRecognition error:', event.error);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    // Stop speech recognition
    const stopSpeechRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    // Move to the next question and handle transitions
    const nextQuestion = () => {
        stopSpeechRecognition(); // Stop transcription for the current question

        // Check if the interview is done
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1); // Move to the next question
        } else {
            setIsDone(true);
            submitTranscriptions();
            navigate('/results');
        }
    };

    // Submit the transcriptions to the backend
    const submitTranscriptions = async () => {
        const formData = new FormData();
        Object.entries(transcriptions).forEach(([questionIndex, transcription]) => {
            formData.append(`question${parseInt(questionIndex) + 1}`, transcription);
        });

        try {
            const response = await fetch('http://18.219.68.51:3000/transcriptions/', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                console.log('Transcriptions submitted successfully');
            } else {
                console.error('Failed to submit transcriptions');
            }
        } catch (err) {
            console.error('Error submitting transcriptions: ', err);
        }
    };

    // Start transcription whenever the question changes
    useEffect(() => {
        if (currentQuestion <= questions.length - 1) {
            startSpeechRecognition(); // Start transcription for the new question
        }
    }, [currentQuestion]);

    useEffect(() => {
        // Start the video automatically on component mount
        startVideo();
        startSpeechRecognition(); // Start the first question transcription immediately

        return () => {
            // Cleanup video and stop any ongoing media streams
            if (streamRef.current) {
                const tracks = streamRef.current.getTracks();
                tracks.forEach(track => track.stop());
            }
            stopSpeechRecognition();
        };
    }, []);

    const playbackScreen = () => {
        const transcriptionsArray = Object.values(transcriptions);
        window.localStorage.setItem('transcriptions', JSON.stringify(transcriptionsArray));

        // Display all transcriptions to current screen
        return (
            <div>
                <h1>Interview Playback</h1>
                <div>
                    {transcriptionsArray.map((transcription, index) => (
                        <div key={index}>
                            <h3>Question {index + 1}</h3>
                            <p>{transcription}</p>
                        </div>
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
                    {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                </Button>
                {questions[currentQuestion] && (
                    <div className="question-text">
                        <h3>Question {currentQuestion + 1}</h3>
                        <p>{questions[currentQuestion]}</p>
                    </div>
                )}
            </div>

            {/* Playback Screen */}
            {isDone && playbackScreen()}
        </div>
    );
};

export default Interview;
