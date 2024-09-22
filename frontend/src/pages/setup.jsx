import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, TextField } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import StartConfirmation from './start_confirmation';

import '../styles/Setup.css';

import { getOCRText } from '../utils/OCR_API.js';

const theme = createTheme({
    typography: {
        fontFamily: 'Sans, Arial, sans-serif',
    },
});


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

    const [isLoadingResults, setIsLoadingResults] = useState(false);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setResume(file);
            setFileName(file.name);
        }
    };

    const handleSubmit = async () => {
        setIsLoadingResults(true);
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

                let questions = data['questions'];
                console.log('Questions:', questions);
                let summary = data['summary'];
                console.log('Summary:', summary);



                // save the response to local storage
                localStorage.setItem('summary', summary);
                localStorage.setItem('questions', questions);

            } else {
                // Handle errors
                console.error('Failed to submit the form');
            }
        } catch (error) {
            console.error('Error submitting the form:', error);
        }
        setIsLoadingResults(false);
    };

    const steps = {
        0: {
            label: 'Job Title',
            content: (
                <div className='content'>
                    <Typography>What job are you applying for?</Typography>
                    <TextField
                        style={{ width: '100%', marginTop: '20px' }}
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
                <div className='content'>
                    <Typography style={{marginBottom: '10px'}}>Upload your Resume</Typography>
                    <Button
                        style={{ width: '100%', marginTop: '20px' }}
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
                <div className='content'>
                    <Typography
                        style={{ marginBottom: '10px' }}
                    >What else should the interviewer know?</Typography>
                    <div className="text-field">
                        <TextField
                            label="Job Information"
                            value={additionalInfo}
                            multiline
                            fullWidth
                            rows={6}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder='Required skills, experience, etc.'
                        />
                    </div>
                    <div className="text-field">
                        <TextField
                            style={{ width: '100%' }}
                            label="LinkedIn Profile Link"
                            value={linkedInProfile}
                            onChange={(e) => setLinkedInProfile(e.target.value)}
                            placeholder='linkedin.com/in/yourprofile'
                        />
                    </div>
                </div>
            )
        }
    };

    const stepLabels = Object.values(steps).map(step => step.label);

    return (
        <ThemeProvider theme={theme}>
            {!hasSubmitted && (
                <>
                    <div className='stepper'>
                        <Stepper activeStep={activeStep}
                            style={{ backgroundColor: 'transparent', width: '90%', margin: 'auto', }}

                            >
                                {stepLabels.map((label, index) => (
                                    <Step key={index}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        </div>
                        <div className='button-container'>
                            <Button
                                onClick={() => { setActiveStep(prev => Math.max(prev - 1, 0)) }}
                                disabled={activeStep === 0}
                            >
                                Back
                            </Button>
                            <Button
                                onClick={() => {
                                    activeStep === stepLabels.length - 1 ? handleSubmit() :
                                        setActiveStep(prev => Math.min(prev + 1, stepLabels.length - 1))
                                }}
                                disabled={activeStep === stepLabels.length}
                            >
                                {activeStep === stepLabels.length - 1 ? 'Submit' : 'Next'}
                            </Button>
                        </div>
                        <Box>
                            <div className='step-content'>
                                {steps[activeStep]?.content}
                            </div>
                        </Box>

                </>
            )}
            {hasSubmitted && <StartConfirmation canStart={!isLoadingResults} />}
        </ThemeProvider>
    );
}
