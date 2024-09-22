import React from "react";
import { useEffect, useState } from "react";


function Results() {
    const [transcriptions, setTranscriptions] = useState({});

    useEffect(() => {
        const transcriptionsJSON = JSON.parse(window.localStorage.getItem('transcriptions'));

        console.log('Transcriptions from storage:', transcriptionsJSON);

        setTranscriptions(transcriptionsJSON);
    }, []);

    return (
        <div>
            <p>Results Page</p>
        </div>
    );
}

export default Results;