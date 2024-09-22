import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StartConfirmation from './start_confirmation';

import '../styles/Setup.css';

import { getOCRText } from '../utils/OCR_API.js';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function Setup() {
    const [activeStep, setActiveStep] = useState(0);
    const [jobTitle, setJobTitle] = useState('');
    const [resume, setResume] = useState(null);
    const [fileName, setFileName] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [linkedInProfile, setLinkedInProfile] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setResume(file);
            setFileName(file.name);
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);  // Strip the base64 prefix
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async () => {
        setHasSubmitted(true);

        let ocrText = null;
        if (resume) {
            try {
                // Send the file to the OCR API
                ocrText = await getOCRText(resume);
                console.log("Extracted Text from OCR API:", ocrText);
            } catch (error) {
                console.error('Error during OCR processing:', error);
            }
        }

        // Create a new FormData object to send the file along with other form data
        const formData = new FormData();
        formData.append('jobTitle', jobTitle);
        formData.append('resume', ocrText); // append the detected text from the resume
        formData.append('additionalInfo', additionalInfo);
        formData.append('linkedInProfile', linkedInProfile);
    
        try {
            // Send a POST request to your backend (adjust the URL accordingly)
            const response = await fetch('http://18.219.68.51:3000/process/', {
                method: 'POST',
                body: formData, // FormData will format everything correctly including the file
            });
    
            if (response.ok) {
                // Handle successful submission
                let data = await response.json();
                console.log('Form submitted successfully');
                console.log('Response:', data);

                // save the response to local storage
                localStorage.setItem('summary', data['summary']);
                localStorage.setItem('questions', data['questions']);

            } else {
                // Handle errors
                console.error('Failed to submit the form');
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
        }
    };

    const steps = {
        0: {
            label: 'Job Title',
            content: (
                <div>
                    <Typography>Job Title</Typography>
                    <TextField
                        label="Job Title"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder='Software Engineer'
                    />
                </div>
            )
        },
        1: {
            label: 'Resume',
            content: (
                <div>
                    <Typography>Resume</Typography>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        startIcon={<CloudUploadIcon />}
                    >
                        Upload files
                        <VisuallyHiddenInput
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Button>
                    {fileName && <Typography variant="body2">Selected file: {fileName}</Typography>}
                </div>
            )
        },
        2: {
            label: 'Additional Information',
            content: (
                <div>
                    <Typography>Additional Information</Typography>
                    <TextField
                        label="Additional Information"
                        value={additionalInfo}
                        multiline
                        rows={6}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        placeholder='Required skills, experience, etc.'
                    />
                    <TextField
                        label="LinkedIn Profile"
                        value={linkedInProfile}
                        onChange={(e) => setLinkedInProfile(e.target.value)}
                        placeholder='linkedin.com/in/yourprofile'
                    />
                </div>
            )
        }
    };

    const stepLabels = Object.values(steps).map(step => step.label);

    return (
        <div>
            {!hasSubmitted && (
                <>
                    <h1>Setup</h1>
                    <Stepper activeStep={activeStep}>
                        {stepLabels.map((label, index) => (
                            <Step key={index}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <Button
                        onClick={() => { setActiveStep(prev => Math.max(prev - 1, 0)) }}
                        disabled={activeStep === 0}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={() => { setActiveStep(prev => Math.min(prev + 1, stepLabels.length - 1)) }}
                        disabled={activeStep === stepLabels.length - 1}
                    >
                        Next
                    </Button>
                    <Box>
                        <div className='step-content'>
                            {steps[activeStep]?.content}
                        </div>
                    </Box>

                    {activeStep === stepLabels.length - 1 && (
                        <Button
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    )}
                </>
            )}
            {hasSubmitted && <StartConfirmation />}
        </div>
    );
}
