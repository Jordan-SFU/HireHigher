import React, { useRef, useState } from 'react';
import '../styles/Interview.css';

import { AudioRecorder } from 'react-audio-voice-recorder';

const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
};

const Interview = () => {

    const [isVideoActive, setIsVideoActive] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            streamRef.current = stream; // Save the stream for later control
            setIsVideoActive(true);
        } catch (err) {
            console.error("Error accessing webcam: ", err);
        }
    };

    // Function to stop the video
    const stopVideo = () => {
        if (streamRef.current) {
            const tracks = streamRef.current.getTracks(); // Get all tracks from the stream
            tracks.forEach(track => track.stop()); // Stop each track (video/audio)
            videoRef.current.srcObject = null; // Clear the video feed
            setIsVideoActive(false);
        }
    };

    return (
        <div className="interview-container">
            {/* Header */}
            <div className="header">
                <h1> Zom </h1>
            </div>

            {/* Video Feeds */}
            <div className="video-section">
                <div className="video-feed" id="user-video">
                    <video ref={videoRef} className="video-element" />
                    <div className="name-tag">You</div>
                </div>
                <div className="video-feed" id="interviewer-video">
                    <div className="name-tag">Interviewer</div>
                </div>
            </div>

            {/* Control Buttons */}
            <div className="controls-section">
                <button className="control-btn">Mute</button>
                <button className="control-btn" onClick={isVideoActive ? stopVideo : startVideo}>
                    {isVideoActive ? 'Stop Video' : 'Start Video'}
                </button>
                <button className="control-btn">Leave Call</button>
                <AudioRecorder
                    onRecordingComplete={addAudioElement}
                    audioTrackConstraints={{
                        noiseSuppression: true,
                        echoCancellation: true,
                    }}
                    downloadOnSavePress={false}
                    downloadFileExtension="webm"
                    showVisualizer={true}
                />
            </div>

            {/* Chat or Notes Section */}
            {/*<div className="chat-section">*/}
            {/*    <h3>Notes</h3>*/}
            {/*    <textarea placeholder="Take notes during the interview..."></textarea>*/}
            {/*</div>*/}
        </div>
    );
};

export default Interview;
