import React, { useState } from 'react';

const Contact = () => {
    const [question, setQuestion] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!question || !email) {
            setMessage("All fields (question, email) are required.");
            return;
        }

        fetch("http://127.0.0.1:5005/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                question,
                email,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to send message.");
                }
                return response.text();
            })
            .then((data) => {
                setMessage(data); 
                setQuestion("");
                setEmail("");
            })
            .catch((error) => {
                setMessage(error.message); 
            });
    };

    return (
        <div>
            <h1>Contact Us</h1>
            <form onSubmit={handleSubmit}>

                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />

                <label>Your Question:</label>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                />
                <br />

                <button type="submit">Send Message</button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default Contact;
