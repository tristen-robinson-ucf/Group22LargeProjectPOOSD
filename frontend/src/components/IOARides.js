import React, { useState, useEffect } from 'react';
import './css/landing.css'
import RidesTemplate from './RidesTemplate';


//////////////////////////////////////////////////////////////////////////////////
// THIS FILE MAY BE DELETED LATER, MOST OF THIS CODE CAN BE FOUND AT /RidesTemplate.js
///////////////////////////////////////////////////////////////////////////////////

function IOARides()
{
    const [rideContent, setRideContent] = useState([]);

    const closed = 1001;
    const open = -2;
    const alphabetical = 0;
    const waitTime = 1;

    var sortBy;

    var rides = [
        ["Camp Jurassic", open],
        ["Caro-Suess-el", 5],
        ["Doctor Doom's Fearfall", 15],
        ["Dudley Do-Right's Ripsaw Falls", 45],
        ["Flight of the Hippogriff", 45],
        ["Hagrid's Magical Creatures Motorbike Adventure", 90],
        ["Harry Potter and the Forbidden Journey", 35],
        ["Hogwarts Express - Hogsmeade Station", 10],
        ["If I Ran The Zoo", open],
        ["Jurassic Park Discovery Center", open],
        ["Jurassic Park River Adventure", closed],
        ["Jurassic World VelociCoaster", 100],
        ["Me Ship, The Olive", open],
        ["One Fish, Two Fish, Red Fish, Blue Fish", 15],
        ["Popeye & Bluto's Bilge-Rat Barges", closed],
        ["Pteranodon Flyers", 35],
        ["Skull Island: Reign of Kong", closed],
        ["Storm Force Accelatron", 5],
        ["The Amazing Adventures of Spider-Man", 50],
        ["The Cat in The Hat", 5],
        ["The High in the Sky Seuss Trolley Train Ride!", 5],
        ["The Incredible Hulk Coaster", 45]
      ];

    function sortRides()
    {
        sortBy = document.getElementById("sortBy").value;

        if(sortBy == alphabetical)
        {
            rides.sort((a, b) => a[0] - b[0]);
        }
        else if(sortBy == waitTime)
        {
            rides.sort((a, b) => a[1] - b[1]);
        }
        createRideButtons();
    }

    function createRideButtons()
    {
        var rideButtons = []
        var button;

        for(let i = 0; i < rides.length; i++)
        {
            if(rides[i][1] == open)
            {
                button = <button key={i} className='waitTimeButton'><text>{rides[i][0]}</text><b className='waitTime'>Open</b></button>
            }
            else if(rides[i][1] == closed)
            {
                button = <button key={i} className='waitTimeButton'><text>{rides[i][0]}</text><b className='waitTime'>Closed</b></button>
            }
            else
            {
                button = <button key={i} className='waitTimeButton'><text>{rides[i][0]}</text><b className='waitTime'>{rides[i][1].toString()}</b></button>
            }
            rideButtons.push(button);
        }
        setRideContent(rideButtons)
    }
    /*useEffect(() => 
    {
        createRideButtons();
    }, []);*/

    return(
        /*<div id='rides'>
            <label for="sortBy">Sort by:</label>
            <select id="sortBy" name="sortBy" onChange={() => sortRides()}>
                <option value={alphabetical}>Alphabetical</option>
                <option value={waitTime}>Wait Time</option>
            </select>
            {rideContent}
        </div>*/
        RidesTemplate(rides)
    )
}

export default IOARides;