import React, { useState, useEffect } from 'react';

function RidesTemplate(rides)
{
    const [rideContent, setRideContent] = useState([]);

    // const closed = 1001;
    // const open = -2;
    // const alphabetical = 0;
    // const waitTime = 1;
    let closed = 1001;
    let open = -2;
    let alphabetical = 0;
    let waitTime = 1;

    var sortBy = alphabetical;

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
                button = <button key={i} className='waitTimeButton'><text>{rides[i][0]}</text><b className='waitTime'>{rides.waitTime[i][1].toString()}</b></button>
            }
            rideButtons.push(button);
        }
        setRideContent(rideButtons)
    }
    useEffect(() => 
    {
        createRideButtons();
    }, []);

    return(
        <div id='rides'>
            <label for="sortBy">Sort by:</label>
            <select id="sortBy" name="sortBy" onChange={() => sortRides()}>
                <option value={alphabetical}>Alphabetical</option>
                <option value={waitTime}>Wait Time</option>
            </select>
            {rideContent}
        </div>
    )
}

export default RidesTemplate;
