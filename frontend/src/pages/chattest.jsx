import React, { useState } from 'react';

const Chattest = () => {
    const [message, setMessage] = useState('');
    const [chatLog, setChatLog] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Add user message to chat log
        setChatLog([...chatLog, { sender: 'user', text: message }]);

        try {
            const response = await fetch('http://localhost:8000/chatbot/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            const data = await response.json();

            // Add bot reply to chat log
            setChatLog([...chatLog, { sender: 'user', text: message }, { sender: 'bot', text: data.reply }]);
            setMessage(''); // Clear input field
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Job Interview Chatbot</h1>
            <div className="chat-log">
                {chatLog.map((entry, index) => (
                    <p key={index} className={entry.sender}>
                        <strong>{entry.sender === 'user' ? 'You' : 'Interviewer'}:</strong> {entry.text}
                    </p>
                ))}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default Chattest;