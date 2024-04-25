import React, { useState, useEffect } from 'react';
import './css/rides.css';
import { useNavigate} from 'react-router-dom';

function RidesTemplate(parkID)
{
    const navigate = useNavigate();
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

    var trips;

    const app_name = 'group-22-0b4387ea5ed6'
    const [avgWaitTimes, setAvgWaitTimes] = useState({});

    useEffect(() => {
        getTrips()
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
                    method: 'POST'
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
    
    const getTrips = async event => 
    {
        var data = localStorage.getItem('user_data')
        var parsedData = JSON.parse(data)
        const userID = parsedData.id
        try
        {
            const response = await fetch(buildPath('api/searchTrip'),{
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    search : "",
                    userID : userID
                })
            });
            console.log(`response status is ${response.status}`);
            const mediaType = response.headers.get('content-type');
            let data;
            if (mediaType.includes('json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
            trips = extractTripInfo(data)
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    }

    const extractTripInfo = (jsonData) => {
        // Ensure 'results' property exists and is an array
        if (!jsonData || !Array.isArray(jsonData['results']) || !jsonData['results'].length) {
          return []; // Return empty array if 'results' is missing, not an array, or empty
        }
      
        const trips = [];
        const tripLength = 4; // Constant for trip info length
      
        // Iterate through results, checking for validity within the array
        for (let i = 0; i < jsonData['results'].length; i += tripLength) {
          if (i + tripLength <= jsonData['results'].length) {
            const trip = [
              jsonData['results'][i],
              jsonData['results'][i + 1],
              jsonData['results'][i + 2],
              jsonData['results'][i + 3],
            ];
            trips.push(trip);
          }
        }
      
        return trips;
      };

      const toggleAddTripDiv = async (id) => {
        console.log(id)
        const div = document.getElementById(id);
        if (div.style.display === 'none') {
            div.style.display = 'block'; // Or 'flex', 'grid', etc., depending on your layout needs
        } else {
            div.style.display = 'none';
        }
        rideID = id;
        console.log(rideID);
    }

    var tripID;
    var rideID;

    const addRideToTrip = async event =>
    {
        try
        {

            const obj = {
                tripID: tripID,
                rideID: rideID
            };

            console.log(obj);
            const requestBody = JSON.stringify(obj);
            console.log(requestBody)
            const response = await fetch(buildPath('api/addRide'),{
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: requestBody
            });
            console.log(`response status is ${response.status}`);
            const mediaType = response.headers.get('content-type');
            let data;
            if (mediaType.includes('json')) {
                data = await response.json();
            } else {
                data = await response.text();
            }
        }
        catch(e)
        {
            alert(e.toString());
            return;
        }
    }

    function createRideButtons(avgWaitTimes)
    {
        var rideCards = []

        for (const ride of rides) 
        {
            //comparison of curr wait time w average wait times (color codes it accrodingly)
            let avgWaitTime = avgWaitTimes[ride.id] !== undefined ? avgWaitTimes[ride.id] : 0;
            let avgWaitTimeText = avgWaitTimes[ride.id] !== undefined ? avgWaitTimes[ride.id].toString() : '';
            let waitTimeText = ride.is_open ? (ride.wait_time > 0 ? ride.wait_time.toString() : '0') : 'Closed';
            let waitTimeClass = ride.is_open ? (ride.wait_time > avgWaitTime ? 'red' : (ride.wait_time < avgWaitTime ? 'green' : 'yellow')) : 'orange';

        
            const rideCard = (
                <div key={ride.id} className='rideCard'>
                    <div className='rideInfo'>
                        <h3> {ride.name}</h3>
                   </div>
                   <div className='addToTripsContainer'>
                        <button onClick={() => {
                            toggleAddTripDiv(ride.id);
                            }}>Add to a trip</button>
                        <div id={ride.id} style={{display: 'none'}}>
                            <select id='tripsSelect' onChange={(e) => tripID = parseInt(e.target.value)}>
                                <option value ="">Select a trip... </option>
                                {trips.map((trip, index) => (
                                    <option key= {index} value={trip[1]}>{trip[0]}</option>
                                ))}
                            </select>
                            <button onClick={addRideToTrip}>Add ride to trip</button>
                        </div>
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

            rideCards.push(rideCard);
        }

        // update state
        setRideContent(rideCards);
    };

    const logOut = async () => {
        navigate(`/landing`);
    };


    return(
        <>
        <div className="ridesTemp">
        <header style = {{background:  '#f78254',  maxWidth: '100vw', userSelect:'none', position: 'fixed', width: '100%'}}>
             <div class="topbar" style ={{width: '100%', maxWidth: '100vw', height: '32px', opacity: '1', transition: 'opacity 700ms ease 0s, color 700ms ease 0s', position: 'relative', paddingBottom: '20px'}}>
                 <div style ={{display:'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', height: '32px', paddingLeft:'12px', paddingRight:'10px'}}>
                     <div className="logoutCont">
                         <button className="logoutButton" onClick={() => logOut ()}>Return</button>
                     </div>
                 </div>
            </div>
        </header>
        </div>
        <div id='rides'>
            {/*<label htmlFor="sortBy">Sort by:</label>
            <select id="sortBy" name="sortBy" onChange={() => sortRides()}>
                <option value={alphabetical}>Alphabetical</option>
                <option value={waitTime}>Wait Time</option>
    </select>*/}
            {rideContent}
        </div>
    </>
    );
}

export default RidesTemplate;