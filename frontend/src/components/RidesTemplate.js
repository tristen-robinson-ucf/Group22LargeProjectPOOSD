import React, { useState, useEffect } from 'react';

function RidesTemplate(parkID)
{
    const [rideContent, setRideContent] = useState([]);

    const closed = 1001;
    const open = -2;
    const alphabetical = 0;
    const waitTime = 1;

    var sortBy = alphabetical;

    var rides = []

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

    const fetchRides = async event => 
    {
        //event.preventDefault();

        var obj = {};
        var js = JSON.stringify(obj);

        try
        {    
            (async () => {
                const response = await fetch(buildPath('api/parks'));
                console.log(`response status is ${response.status}`);
                const mediaType = response.headers.get('content-type');
                let data;
                if (mediaType.includes('json')) {
                  data = await response.json();
                } else {
                  data = await response.text();
                }
                console.log(data);
              })();
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    };

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
    useEffect(() => 
    {
        fetchRides();
        //createRideButtons();
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