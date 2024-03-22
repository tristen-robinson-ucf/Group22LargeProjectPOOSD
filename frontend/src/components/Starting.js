import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import './css/starting.css'

function Starting(){
    return(
        <div className="startDiv">
         <div className="photoCont"> 
             <img src='/images/startingpg.webp' className='parkImage'/>
             <img src='/images/logo.webp' className='logo'/>
         </div>

         <p className="text"> Track the wait times for all your favorite rides! </p>

         <div className="startButtons">
            <Link to="/login">
                <button className="loginButton" >Log in</button>
            </Link>  

            <Link to="/register">
                <button className="registerButton" >Register</button>
            </Link>
         </div>
        </div>
    );
};

export default Starting;