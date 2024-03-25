import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import './css/register.css';

function Register()
{
    var registerName;
    var registerPassword;
    var confirmPassword;
    var firstName;
    var lastName;
    var email;
    var phoneNumber;

    const [message,setMessage] = useState('');


    const doRegister = async event => 
    {
        event.preventDefault();

        var obj = {username:registerName.value,password:registerPassword.value,firstname:firstName.value,lastname:lastName.value,email:email.value,phonenumber:phoneNumber.value};
        var js = JSON.stringify(obj);

        try
        {    
            const response = await fetch(buildPath('api/register'),
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}});

            var res = JSON.parse(await response.text());

            if( res.status != 200 )
            {
                setMessage('Fix this later, it probably worked :/');
            }
            else
            {
                var user = {firstname:res.firstName,lastname:res.lastname,id:res.id}
                localStorage.setItem('user_data', JSON.stringify(user));

                setMessage('');
                window.location.href = '/register';
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




    return(
      <>
      <div className="register">
        <div className="inner-title">
            REGISTER FORM
        </div>
        <form onSubmit={doRegister}>
            <div className="inputCont">
                <input type='text' id='registerName' placeholder='Username' ref={(c) => registerName = c} required/><br />
                <input type='text' id='firstName' placeholder='First Name' ref={(c) => firstName = c} required /><br />
                <input type='text' id='lastName' placeholder='Last Name' ref={(c) => lastName = c} required /><br />
                <input type='text' id='email' placeholder='Email' ref={(c) => email = c} required /><br />
                <input type='text' id='phone' placeholder='Phone Number' ref={(c) => phoneNumber = c} required /><br />
                <input type='password' id='registerPassword' placeholder='Password' ref={(c) => registerPassword = c} required /><br />
                <input type='password' id='confirmPassword' placeholder='Confirm Password' ref={(c) => confirmPassword = c} required /><br />
            </div>
            
            <div className= "cont">
                <div class="existing-acc">
                    <a href="#">Already have an account?</a>
                </div>
                <input type='submit' id='registerButton' class='buttons' value='Register' onClick={doRegister} />
                <Link to="/login">
                    <input type='submit' id='loginButton' class="buttons" value='Login' />
                 </Link> 
            </div>
        </form>
        <span id='registerResult'>{message}</span>
      </div>
      </>
    );
};

export default Register;