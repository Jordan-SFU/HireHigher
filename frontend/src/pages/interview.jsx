import React, { useRef, useState, useEffect } from 'react';
import { Stepper, Step, StepLabel, Button } from '@mui/material';
import '../styles/Interview.css';
import { useNavigate } from 'react-router-dom';

const Interview = () => {
    const navigate = useNavigate();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [transcriptions, setTranscriptions] = useState({});
    const [analyses, setAnalyses] = useState({});
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const recognitionRef = useRef(null);
    const [isDone, setIsDone] = useState(false);

    const [questions, setQuestions] = useState({});
    const [summary, setSummary] = useState({});

    const [questionCount, setQuestionCount] = useState(0);

    const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(false);

    const [times, setTimes] = useState([]);
    const [startTime, setStartTime] = useState(0);

    useEffect(() => {
        const summaryJSON = JSON.parse(window.localStorage.getItem('summary'));
        const questionsJSON = JSON.parse(window.localStorage.getItem('questions'));

        console.log('Summary from storage:', summaryJSON);
        console.log('Questions from storage:', questionsJSON);

        setSummary(summaryJSON);
        setQuestions(questionsJSON);
    }, []);

    useEffect(() => {
        console.log('Updated Summary:', summary);
        console.log('Updated Questions:', questions);

        let count = 0;
        for (let key in questions) {
            if (questions.hasOwnProperty(key)) {
                count++;
            }
        }
        setQuestionCount(count);
        console.log('Question Count:', count);
    }, [summary, questions]);

    // Start the video feed
    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            streamRef.current = stream;

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
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            console.log('Transcript:', transcript);

            // Save the transcription for the current question
            setTranscriptions(prevTranscriptions => ({
                ...prevTranscriptions,
                [currentQuestion]: {
                    question: questions[currentQuestion + 1], // Save the question
                    transcription: transcript // Save the transcription
                }
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
    const nextQuestion = async () => {
        stopSpeechRecognition();
    
        const endTime = Date.now();
        const elapsedTime = (endTime - startTime) / 1000;
        setTimes(prevTimes => [...prevTimes, elapsedTime]);

        // Check if the interview is done
        if (currentQuestion < questionCount) {
            setCurrentQuestion(prev => prev + 1);
            setStartTime(Date.now());
        } else {
            // Ensure the last transcript is saved before submitting
            setTranscriptions(prevTranscriptions => {
                // Ensure the last transcript is captured here (if needed)
                return { ...prevTranscriptions };
            });
    
            setIsLoadingAnalyses(true);
            await submitTranscriptions();  // Submit the transcriptions after the last state update
            setIsLoadingAnalyses(false);
            setIsDone(true);
        }
    };

    // Submit the transcriptions to the backend
    const submitTranscriptions = async () => {
        const formData = new FormData();
        Object.entries(transcriptions).forEach(([questionIndex, { question, transcription }]) => {
            formData.append(`question${parseInt(questionIndex) + 1}`, question); // Add question
            formData.append(`transcription${parseInt(questionIndex) + 1}`, transcription); // Add transcription
        });
    
        try {
            const response = await fetch('http://18.219.68.51:3000/transcriptions/', {
                method: 'POST',
                body: formData
            });
            if (response.ok) {
                console.log('Transcriptions submitted successfully');
                let data = await response.json();
                setAnalyses(data);
                console.log('Analyses:', data);
            } else {
                console.error('Failed to submit transcriptions');
            }
        } catch (err) {
            console.error('Error submitting transcriptions: ', err);
        }
    };
    

    // Start transcription whenever the question changes
    useEffect(() => {
        if (currentQuestion <= questionCount - 1) {
            startSpeechRecognition();
            setStartTime(Date.now());
        }
    }, [currentQuestion]);

    useEffect(() => {
        startVideo();
        startSpeechRecognition();

        return () => {
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
    
        // Function to calculate words per minute
        const calculateWPM = (transcription, timeInSeconds) => {
            const wordCount = transcription ? transcription.split(' ').filter(word => word.length > 0).length : 0;
            const timeInMinutes = timeInSeconds / 60;
            return timeInMinutes > 0 ? (wordCount / timeInMinutes).toFixed(2) : 0; // Ensure no division by zero
        };
    
        return (
            <div>
                <h1>Interview Playback</h1>
                <div>
                    {transcriptionsArray.map((transcriptionOBJ, index) => (
                        <div key={index}>
                            <h3>Question {index + 1}</h3>
                            <h5>{questions[index + 1]}</h5>
                            <p>{transcriptionOBJ.transcription}</p>
                            <p>{analyses['analyses'][index]}</p>
                            <p>Time taken: {times[index + 1]} seconds</p>
    
                            {/* Display WPM */}
                            <p>Words per minute: {calculateWPM(transcriptionOBJ.transcription, times[index + 1])}</p>
                        </div>
                    ))}
                </div>
                <Button onClick={() => navigate('/')}>Try Again?</Button>
            </div>
        );
    };

    return (

        <div className="interview-container">
            {!isDone && !isLoadingAnalyses && (
            <>
                {/* Header */}
                <div className="header">
                </div>

                {/* Video Feeds */}
                <div className="video-section">
                    <div className="video-feed" id="user-video">
                        <video ref={videoRef} className="video-element" />
                        <div className="name-tag">You</div>
                    </div>
                    <div className="video-feed" id="interviewer-video">
                        <div className="black-screen" /> {/* Placeholder for interviewer */}
                        <div className="name-tag">Interviewer</div>
                    </div>
                </div>

                {/* Question Stepper */}
                {questionCount > 0 ? (
                    <div className="stepper-section" style={{ position: 'fixed', top: '50%', width: '100%'}}>
                        <Stepper activeStep={currentQuestion} alternativeLabel >
                            {Object.values(questions).map((_, index) => (
                                <Step key={index}>
                                    <StepLabel>{`Question ${index + 1}`}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>

                        {questions[currentQuestion + 1] && (
                            <div className="question-text" style={{position: 'relative', display: 'grid', marginTop: '4%', width: '100%', justifyContent: 'center' }}>
                                <p>{questions[currentQuestion + 1]}</p>
                            </div>
                        )}

                        <Button
                            className="control-btn"
                            style={{position: 'relative', display: 'grid', marginTop: '4%', left:'44%', justifyContent: 'center' }}
                            onClick={nextQuestion}
                        >
                            {currentQuestion < questionCount - 1 ? 'Next Question' : 'Finish Interview'}
                        </Button>
                    </div>
                ) : (
                    <p>Loading questions...</p> // Fallback in case questions are still being loaded
                )}
            </>)}
            {/* Playback Screen */}
            {isDone && !isLoadingAnalyses && analyses && playbackScreen()}
            {isLoadingAnalyses && <p>Submitting transcriptions...</p>}
        </div>
    );
};

export default Interview;
