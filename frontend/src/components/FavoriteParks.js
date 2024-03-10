import React, { useState, useEffect } from 'react';
import './css/landing.css'

const ioa = 64;
const usf = 65;
var userID = 2; // API
var favoriteParks = [ioa, usf]; // API



function FavoriteParks()
{
    const [parkContent, setParkContent] = useState([]);

    function createParks() //API // creates the buttons to view each park
    {
        var parks = [];
        if(favoriteParks.includes(ioa))
        {
            const ioaElement = <div key="ioa"><button id='ioaButton' onClick={() => redirect(ioa)} className='parkButton'><img src='/images/ioa.webp' className='parkImage'/></button></div>;
            parks.push(ioaElement);
        }
        if(favoriteParks.includes(usf))
        {
            const usfElement = <div key="usf"><button id='usfButton' onClick={() => redirect(usf)} className='parkButton'><img src='/images/usf.webp'className='parkButton'/></button></div>;
            parks.push(usfElement);
        }
        setParkContent(parks);
    }

    function redirect(parkID)
    {
        window.location.href = `/parks/${parkID}`;
    }

    useEffect(() => 
    {
        createParks();
    }, []);

    return(
        <div id='favoriteParks'>
            {parkContent}
        </div>
    );
};

export default FavoriteParks;