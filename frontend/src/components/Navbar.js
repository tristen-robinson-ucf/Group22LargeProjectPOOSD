import React from 'react';
import { Link } from 'react-router-dom';


function Navbar(){
   
    return(
        <nav className="navbar">
            <ul className ="link">
                <li><Link to= "/">Home</Link></li>
                <li><Link to= "/login">Log in</Link></li>
                <li><Link to= "/register">Register</Link></li>
            </ul>
        </nav>
    
    );
}

export default Navbar;