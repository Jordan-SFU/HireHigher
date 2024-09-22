import React from "react";

import { Button, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function StartConfirmation(props) {
    const navigate = useNavigate();

    return (
        <div>
            {!props.canStart && <>
            <p>Generating Questions</p>
            <CircularProgress color="primary" />
            </>}

            {props.canStart && 
            <Button onClick={() => {navigate("/interview")}}>Start the Interview</Button>
            }
        </div>
    );
}

export default StartConfirmation;