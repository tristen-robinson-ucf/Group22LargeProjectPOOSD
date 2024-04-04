import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import './css/register.css';
import emailjs from 'emailjs-com';


function Register()
{
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message,setMessage] = useState('');
    const [showEmailVerification, setShowEmailVerification] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [enteredCode, setEnteredCode] = useState('');
    const [codeVerified, setCodeVerified] = useState('');

    const doRegister = async event => 
    {
        event.preventDefault();
        verifyCode();

       var obj = {
         username, 
         password, 
         firstname: firstName,
         email : regEmail, 
         phonenumber: phoneNumber
       };

        //var obj = {username,password,firstname:firstName,lastname:lastName,email,phonenumber:phoneNumber};
        var js = JSON.stringify(obj);
        console.log(js);

        try
        {    
            const response = await fetch(buildPath('api/register'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());
            console.log(res);

            if( res.status != 200 )
            {
                setMessage('Fix this later, it probably worked :/');
            }
            else
            {
                var user = {firstname:res.firstName,lastname:res.lastname,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                //window.location.href = '/register';
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    };

    const app_name = 'group-22-0b4387ea5ed6'
    function buildPath(route)
    {
        if (process.env.NODE_ENV === 'production') 
        {
            return 'https://' + app_name +  '.herokuapp.com/' + route;
        }
        else
        {        
            return 'http://localhost:5000/' + route;
        }
    }

    const emailVerification = async (email, e) =>
     {
        e.preventDefault();

        try{
            const verificationCode = generateVerificationCode();
            await sendEmail(email, verificationCode);
            setVerificationCode(verificationCode);
            setShowEmailVerification(true);
        }
        catch (error){
            setMessage('Error sending email');
        }



     };


     const generateVerificationCode = () => {
        return Math.floor(100000 + Math.random() * 900000);
    };

    const sendEmail = async (email, verificationCode) => {
        try{
             emailjs.send(
                'service_acia3fd', //service id
                'template_rem2cgg', //template id
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

    return(
      <>
      {!showEmailVerification ? ( 
        <div className="register">
        <div className="inner-title">Register Form</div>
        <form onSubmit={(e)=> emailVerification(regEmail, e)}>
            <div className="inputCont">
                <div>
                    <span class="details">Username</span>
                    <input type='text' id='registerName' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required/><br />
                </div>
                <div>
                    <span class="details">First Name</span>
                    <input type='text' id='firstName' placeholder='First Name'  value={firstName} onChange={(e) => setFirstName(e.target.value)} required /><br />
                </div>
                <div>
                    <span class="details">Last Name</span>
                    <input type='text' id='lastName' placeholder='Last Name' value={lastName} onChange={(e) => setLastName(e.target.value)} required /><br />
                </div>
                <div>
                    <span class="details">Email</span>
                    <input type='text' id='email' placeholder='Email' value={regEmail} onChange={(e) => setRegEmail(e.target.value)} /><br />
                </div>
                <div>
                    <span class="details">Phone Number</span>
                    <input type='text' id='phone' placeholder='Phone Number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}required /><br />
                </div>
                <div>
                    <span class="details">Password</span>
                    <input type='password' id='registerPassword' placeholder='Password'  value = {password} onChange={(e) => setPassword(e.target.value)}required /><br />
                </div>
                <div className= "centered">
                    <span class="centDetails">Confirm Password</span>
                    <input type='password' id='confirmPassword' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}required /><br />
                </div>
            </div>
            
            <div className= "cont">
                <div class="regBttn">
                    <input type='submit' class='buttons' value='Register' />
                </div>
                
                <div className="parent">
                     <div class="existing-acc">
                         <p style={{color:'grey'}}>Already have an account?</p>
                         <a href="/login">Log in Here</a>
                     </div>
                </div>
            </div>
            <span id='registerResult'>{message}</span>
        </form>
      </div>
    ) : (
      <div className="emailVerification">
        <form onSubmit={doRegister}>
            <div className="inner-title">
                 Email Verification Form
             </div>

             <div className="txt">
                <p style= {{textAlign: 'center'}}>Please enter the 6-digit code sent to your registered email:</p>
             </div>

             <div class ="emailInp">
                <input type="text" id="verificationCode" placeholder="Enter Verification Code" value={enteredCode} onChange={(e) => setEnteredCode(e.target.value)} required />
             </div>

             <div class="regBttn">
                <input type='submit' class='buttons' value='Submit' />
            </div>

            <p style={{textAlign: 'center'}}>{message}</p>

            <div className="retParent">
                <div class="returnLogin">
                    <a href="/login"> Back to login </a>
                </div>
            </div>

        </form>
      </div>
    )}
  </>
 );
}

export default Register;