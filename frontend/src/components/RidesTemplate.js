import React, { useState, useEffect } from 'react';

function RidesTemplate(parkID)
{
    try
    {
        parkID = parkID.parkID
    }
    catch(e)
    {
        console.log(e)
    }
    const [rideContent, setRideContent] = useState([]);

    const alphabetical = 0;
    const waitTime = 1;

    var sortBy = alphabetical;

    var ridesData = []
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

        var obj = {parkID:parkID};
        var js = JSON.stringify(obj);

        try
        {    
            (async () => {
                const response = await fetch(buildPath('api/rides'), {headers:{'Content-Type': 'application/json'}, body:js, method: 'POST'});
                console.log(`response status is ${response.status}`);
                const mediaType = response.headers.get('content-type');
                let data;
                if (mediaType.includes('json')) {
                  data = await response.json();
                } else {
                  data = await response.text();
                }
                console.log(data);
                ridesData = data
                rides = extractRideInfo(ridesData)
                createRideButtons();
              })();
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }    
    };

    function extractRideInfo(jsonData) 
    {
        const rideInfo = [];
        // Iterate over each land
        for (const land of jsonData.lands) 
        {
            // Iterate over rides in each land
            for (const ride of land.rides) 
            {
                // Extract ride name and wait time
                const rideName = ride.name;
                const waitTime = ride.wait_time;
                const isOpen = ride.is_open;
                const id = ride.id
                // Add ride info to rideInfo array
                rideInfo.push({ id: id, name: rideName, wait_time: waitTime, is_open:isOpen });
            }
        }
        return rideInfo;
    }

    function sortRides() {
        sortBy = document.getElementById("sortBy").value;
    
        if (sortBy == 'alphabetical') 
        {
            // Sort rides alphabetically by name
            rides.sort((a, b) => a.name.localeCompare(b.name));
        } 
        else if (sortBy == 'waitTime') 
        {
            // Sort rides by wait time
            rides.sort((a, b) => a.wait_time - b.wait_time);
        }
    
        // After sorting, recreate ride buttons
        createRideButtons();
    }
    
    

    function createRideButtons()
    {
        var rideButtons = []
        var button;

        for (const ride of rides) 
        {
            let waitTimeText = '';
            if (ride.is_open) 
            {
                waitTimeText = 'Open';
            } 
            else 
            {
                waitTimeText = 'Closed';
            }

            // If the ride is open and there's a wait time, display the wait time
            if (ride.is_open && ride.wait_time > 0) 
            {
                waitTimeText = ride.wait_time.toString();
            }

            // Create button element
            button = (
                <button key={ride.id} className='waitTimeButton'>
                    <text>{ride.name}</text>
                    <b className='waitTime'>{waitTimeText}</b>
                </button>
            );

            // Push button to rideButtons array
            rideButtons.push(button);
        }

        // Update state with rideButtons
        setRideContent(rideButtons);
    }


    useEffect(() => 
    {
        fetchRides();
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