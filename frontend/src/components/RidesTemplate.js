import React, { useState, useEffect } from 'react';
import './css/rides.css';

function RidesTemplate(parkID)
{
    console.log('park id within rides template', parkID);
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
    const [avgWaitTimes, setAvgWaitTimes] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const ridesResponse = await fetchRides(); 
            const avgWaitTimes = await fetchAverageWaitTimes(ridesResponse); 
            createRideButtons(avgWaitTimes); 
        };
    
        fetchData();
    }, []);

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

    const fetchRides = async event => {
        var obj = {parkID:parkID};
        var js = JSON.stringify(obj);
    
        try {    
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
            ridesData = data;
            rides = extractRideInfo(ridesData);

            return rides;
        }
        catch(e) {
            alert(e.toString());
            return;
        }    
    };

    //fetching average wait times from the histogram api! 
    const fetchAverageWaitTimes = async () => {
        try {
            const avgWaitTimesData = {};

            for (const ride of rides){
                //fetch histogram from api 
                const url = `${buildPath('api/averageWaitTime')}?parkID=${parkID}&rideID=${ride.id}`;
                
                const response = await fetch(url, {
                    method: 'GET'
                });

                if (response.ok){
                    const avgHistogram = await response.json();
                    //console.log('recieved histogram:', avgHistogram); 

                    let maxFreq = 0;
                    let maxFreqRange = '';

                    //looking for the highest freq in histogram
                    if (Object.keys(avgHistogram).length > 0) {
                        for (const range in avgHistogram) {
                            const frequency = avgHistogram[range];
                            if (frequency > maxFreq) {
                                maxFreq = frequency;
                                maxFreqRange = range;
                            }
                        }
    
                        // get the upperbound of the highest freq 
                        const maxFreqRangeParts = maxFreqRange.split('-');
                        const maxFreqRangeUpperBound = parseInt(maxFreqRangeParts[1]);
    
                        //update avgtimesdata 
                        avgWaitTimesData[ride.id] = maxFreqRangeUpperBound; 
                        //console.log('status of avgwaittimesdata:', avgWaitTimesData);
                       // console.log(`Max wait time for ${ride.name}: ${maxFreqRangeUpperBound}`);
                    
                    } else {
                        //if no histogram assume wait time of 0
                        avgWaitTimesData[ride.id] = 0;
                    }

                }
                else{
                    console.log('No average wait time available');
                }
            }  
            console.log('END OF FETCH AVG:', avgWaitTimesData);
            return avgWaitTimesData;
          }  catch (error){
            console.log('Error fetching average wait times', error);
            return {};
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
    
    

    function createRideButtons(avgWaitTimes)
    {
        var rideCards = []

        for (const ride of rides) 
        {
            let waitTimeText = ride.is_open ? (ride.wait_time > 0 ? ride.wait_time.toString() : 'Open') : 'Closed';
            let avgWaitTime = avgWaitTimes[ride.id] !== undefined ? avgWaitTimes[ride.id] : 0;
            let avgWaitTimeText = avgWaitTimes[ride.id] !== undefined ? avgWaitTimes[ride.id].toString() : '';

            let waitTimeClass = '';
            if (ride.wait_time > avgWaitTime) {
                waitTimeClass = 'red';
            } else if (ride.wait_time < avgWaitTime) {
                waitTimeClass = 'green';
            } else {
                waitTimeClass = 'yellow';
            }


            // Create button element
            const rideCard = (
                <div key={ride.id} className='rideCard'>
                    <div className='rideInfo'>
                        <h3> {ride.name}</h3>
                   </div>
                    <div className= 'waitTimeContainer'>
                        <span className='waitTimeTitle'>Current Time:</span>
                        <span className={`waitTime ${waitTimeClass}`}>
                            {waitTimeText}  
                        </span>
                    </div>
                    <div className= 'avgWaitTimeContainer'>
                        <span className='avgWaitTimeTitle'>Average Time:</span>
                        <span className= 'avgWaitTime'>
                            {avgWaitTimeText}
                         </span>
                    </div>
                </div>
            );

            // Push button to rideCards array
            rideCards.push(rideCard);
        }

        // Update state with rideCards
        setRideContent(rideCards);
    };

    

    return(
        <div id='rides'>
            <label htmlFor="sortBy">Sort by:</label>
            <select id="sortBy" name="sortBy" onChange={() => sortRides()}>
                <option value={alphabetical}>Alphabetical</option>
                <option value={waitTime}>Wait Time</option>
            </select>
            {rideContent}
        </div>
    )
}

export default RidesTemplate;