import React, { useState, useEffect } from 'react';
import './css/landing.css'

var userID = 2; // API
var favoriteParks = [64, 65]; // API



function FavoriteParks()
{
    const [parkContent, setParkContent] = useState([]);

    function createParks() //API // creates the buttons to view each park
    {
        var parks = [];
        if(favoriteParks.includes(64))
        {
            const ioaElement = <div key="ioa"><img src='/images/ioa.webp'className='parkButton'/></div>;
            parks.push(ioaElement);
        }
        if(favoriteParks.includes(65))
        {
            const usfElement = <div key="usf"><img src='/images/usf.webp'className='parkButton'/></div>;
            parks.push(usfElement)
        }
        setParkContent(parks);
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