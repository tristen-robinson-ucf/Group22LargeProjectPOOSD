import React, { useState } from 'react';
import {Link} from 'react-router-dom';
import './css/starting.css'

function Starting(){
    return(
        <div className="startDiv">
            
         {/*<div className="photoCont"> 
             <img src='/images/startingpg.webp' className='parkImg'/>
             <img src='/images/logo.webp' className='logo'/>
    </div>*/}

            <div className="navigateDiv">
                <div className="navigateInfo">
                    <img src='/images/logo.webp' className='logo'/>
                    <p className="text"> Plan Your Park Adventure, Instantly Access Wait Times! </p>
                    <div className="borderBtm"></div>
                    <div className="startButtons">
                        <Link to="/login">
                            <button className="loginButton" >Log in</button>
                         </Link>  

                        <Link to="/register">
                            <button className="registerButton" >Register</button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="imgDiv">
                <img src='/images/startingImg.webp' className= 'startGraphic'/>
            </div>

        
        </div>
    );
};

export default Starting;