import React, { useState } from 'react';
import { Stepper, Step, StepLabel, Button, Typography, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setResume(file);
            setFileName(file.name);
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
                </div>
            )
        }
    };

    const stepLabels = Object.values(steps).map(step => step.label);

    return (
        <div>
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
                {steps[activeStep]?.content}
            </Box>
        </div>
    );
}
