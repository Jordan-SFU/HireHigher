import React from 'react';
import { useState } from "react";

import { Stepper, Step, StepLabel, Button, Typography, Box } from '@mui/material';

export default function Setup() {
    const [activeStep, setActiveStep] = useState(0);

    const steps = {
        0: {
            label: 'Job Title',
            content: (
                <div>
                    <Typography>Job Title</Typography>
                </div>
            )
        },
        1: {
            label: 'Resume',
            content: (
                <div>
                    <Typography>Resume</Typography>
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
