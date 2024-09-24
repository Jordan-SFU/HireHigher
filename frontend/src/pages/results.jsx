// http://http://127.0.0.1:8000 highlight to replace

import React from "react";
import { useEffect, useState } from "react";

function Results() {
    const [transcriptions, setTranscriptions] = useState({});
    const [analyses, setAnalyses] = useState({});

    useEffect(() => {
        const transcriptionsJSON = JSON.parse(window.localStorage.getItem('transcriptions'));
        const analysesJSON = JSON.parse(window.localStorage.getItem('analyses'));

        console.log('Transcriptions from storage:', transcriptionsJSON);
        console.log('Analyses from storage:', analysesJSON);

        setTranscriptions(transcriptionsJSON);
        setAnalyses(analysesJSON);
    }, []);

    return (
        <div>
            <p>Results Page</p>
            {transcriptions && analyses &&
            (Object.keys(transcriptions).map((key) => {
                return (
                    <div key={key}>
                        <h3>Question {key}</h3>
                        <p>{transcriptions[key]}</p>
                        <p>{analyses[key]}</p>
                    </div>
                );
            }))}
        </div>
    );
}

export default Results;