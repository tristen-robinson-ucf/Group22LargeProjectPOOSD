import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import emailjs from 'emailjs-com';
import './css/forgot.css';

function ForgotPassword() {
    const [username, setUsername] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [verificationCodeSent, setVerificationCodeSent] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    const [enteredCode, setEnteredCode] = useState('');
    const [confirmPassword, setConfirmedPassword] = useState('');

    //diff message consts
    const [userMessage, setUserMessage] = useState('');
    const [updatePasswordMessage, setUpdatePasswordMessage] = useState(''); 
    const [resendCodeMessage, setResendCodeMessage] = useState('');
    const [generalMessage, setGeneralMessage] = useState('');

    const sendVerificationEmail = async (e) => {
        e.preventDefault();

        try{
        //looking for email associated with username
             const response = await fetchUserInfo(username);
             if (response.ok){
                 const data = await response.json();
                 if (data.email){
                    const email = data.email;
                    const verificationCode = generateVerificationCode();
                    sendEmail(email,verificationCode);
                    setVerificationCode(verificationCode);
                    console.log(verificationCode); //debugging
                    if (verificationCodeSent){
                        setResendCodeMessage('A verification code was resent to your email.');
                    }
                    setVerificationCodeSent(true);
                    //setMessage('A verification code was sent to your email. Please enter the 6 digit code below:');
                 }
                 else{
                    throw new Error('User not found')
                 }
            
             }else{
                throw new Error('User not found');
             }
        }catch(error){
            setUserMessage('User not found');
        }
    
    };

    //ensure the verification code matches the one sent 
    const verifyCode = () => {
        const verificationCodeString = verificationCode.toString();
        const enteredCodeStr = enteredCode.toString();

        const trimVerificationCode = verificationCodeString.trim();
        const trimEnteredCode = enteredCodeStr.trim();

        
        if (trimVerificationCode === trimEnteredCode){
            setCodeVerified(true);
            setMessage('');
        }
        else{
            setCodeVerified(false);
            setMessage('Incorrect verification code');
        }
    };

    //call api! 
    const updatePassword = async (e) => {
        e.preventDefault();

        //make sure matches
        verifyCode();
        if (codeVerified){
            if (newPassword === confirmPassword){
                try{
                    const userBod = JSON.stringify({
                        username: username, 
                        password: newPassword
                    })
                    const response = await fetch (('https://group-22-0b4387ea5ed6.herokuapp.com/api/updatePassword'),
                    {method:'POST',headers:{'Content-Type': 'application/json'}, body: userBod});
        
                    if (response.ok){
                        setMessage('Password updated successfully!');
                    }
                    else{
                        setMessage('Failed to update password');
                    }
                } catch (error){
                    setMessage('Error updating password');
                }
            } else{
                setMessage('Passwords do not match');
            }
        }    
    };


    //fetching user from api given the username
    const fetchUserInfo = async (username) => {
        const userBody = JSON.stringify(
            {username: username}
        );

        return await fetch ('https://group-22-0b4387ea5ed6.herokuapp.com/api/password',
            {method:'POST',body:userBody,headers:{'Content-Type': 'application/json'}});
    };


    //gen random 6 digit code 
    const generateVerificationCode = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };

    const sendEmail = async (email, verificationCode) => {
        try{
            //email js info
             emailjs.send(
                'service_acia3fd', //service id
                'template_x957cfs', //template id
                {
                    to_email: email, 
                     verification_code: verificationCode
                 },
                 'yEHXfF3ZLhX0xblF7' // public key 
             );
         }catch (error){
                setMessage('Error sending email');
                console.log('Email sent error:', error);
        }    
    };


    return(
        <div class="forgot">
            <div class="forgotImg">
                <img src='/images/forgotIcon.webp' />
            </div>
           <div class="title">
                Forgot Password
           </div>
           {verificationCodeSent ? (
            <form className="sendVerificationForm" onSubmit={updatePassword}>
                <div className="passInp">
                    <p style ={{textAlign: 'center'}}>A verification code was sent to your email. Please enter the 6 digit code below:</p>
                    <input type="text" placeholder="Enter verification code" value={enteredCode} onChange={(e) => setEnteredCode(e.target.value)} required />
                    <input type="password" placeholder="Enter your new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    <input type="password" placeholder="Confirm your new password" value={confirmPassword} onChange={(e) => setConfirmedPassword(e.target.value)} required />
                
                     <div id ="passBttn">
                        <button type="submit" id="updatePass">Update Password</button>
                        <button type="submit" id="resendCode" onClick={sendVerificationEmail}>Resend Code</button>
                     </div>
                    
                    <div className="mssg">
                        {message && <p style ={{textAlign: 'center', marginTop: '1px', marginBottom: '3px'}}>{message}</p>}
                        {resendCodeMessage && (<p style={{ textAlign: 'center', marginTop: '10px', marginBottom: '3px' }}>{resendCodeMessage}</p>)}
                    </div>
                    
                    <div className="retParent">
                        <div class="returnLogin">
                             <a href="/login"> Back to login </a>
                        </div>
                    </div>

                </div>
            </form>
           ): (
            <form className="updatePassForm" onSubmit={sendVerificationEmail}>
                <p div id= "text">Enter your username and we'll send you a code to reset your password.</p>
                <div className="inpCont">
                 <input type="text" placeholder="Enter your username" value={username} onChange={(e) => setUsername(e.target.value)} required />
                 {userMessage && <p style={{ marginTop: '0px', marginBottom: '0px', textAlign: 'center' }}>{userMessage}</p>}
                 <div id="bttn">
                    <button type="submit" id="sendEmail">Submit</button>
                    <div className="retLogin">
                        <a href="/login"> Back to login </a>
                    </div>
                 </div>
                </div>
            </form>
           )}
        </div>
    );
}

export default ForgotPassword;