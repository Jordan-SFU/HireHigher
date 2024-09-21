import React from "react";

import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function StartConfirmation() {
    const navigate = useNavigate();

    return (
        <div>
            <p>insert summarized user info here</p>
            <Button onClick={() => {navigate("/interview")}}>Start the Interview</Button>
        </div>
    );
}

export default StartConfirmation;