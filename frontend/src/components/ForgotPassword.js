import React, { useState } from 'react';
import emailjs from 'emailjs-com';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [message, setMessage] = useState('');

    const sendVerificationEmail = (e) => {
        e.preventDefault();

        //emailjs info! 
        const serviceId = 'service_acia3fd';
        const templateId = 'template_x957cfs';
        const userId = 'yEHXfF3ZLhX0xblF7';

        const templateParams = {
            to_email: email,
            verification_code: generateVerificationCode(),
        };

        emailjs.send(serviceId, templateId, templateParams, userId)
            .then((response) => {
                console.log('Email sent:', response);
                setMessage('Email sent!');
            })
            .catch((error) => {
                console.error('Error sending email:', error);
                setMessage('Failed to send email. Please try again');
            });
    };

    /* TODO : connect with api... 
    const updatePassword = async event =>
    {
        event.preventDefault();

        try{
            if(verificationCode !== localStorage.getItem('verificationCode')){
                setMessage('Wrong verification code');
                return;
            }

            const response = await fetch(buildPath('api/updatePassword'),
             {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});
        }
    }
    */

    //gen random 6 digit code 
    const generateVerificationCode = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };

    return(
        <div>
        <h1 id="title">Forgot Password Page!</h1>
        <form onSubmit={sendVerificationEmail}>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <button type="submit">Send Verification Email</button>
            </form>
            {message && <p>{message}</p>}
        </div>

    );
}

export default ForgotPassword;