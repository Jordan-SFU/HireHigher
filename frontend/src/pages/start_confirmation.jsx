import React from "react";

import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

import "../styles/StartConfirmation.css";

function StartConfirmation(props) {
    const navigate = useNavigate();

    return (
        <div className="start-confirmation">
            {!props.canStart && <>
            <p>Generating Questions</p>
            <CircularProgress color="primary" />
            </>}

            {props.canStart && 
            <Button style={{borderRadius: '20px'}} variant="contained" onClick={() => {navigate("/interview")}}><h1>Start the Interview</h1></Button>
            }
        </div>
    );
}

export default StartConfirmation;