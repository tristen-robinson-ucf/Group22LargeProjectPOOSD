import React, { useState, useEffect } from 'react';
import './css/rides.css';
import { useNavigate} from 'react-router-dom';

function TripsTemplate(tripID)
{
    const navigate = useNavigate();

    const [parks, setParks] = useState([]);

    //console.log('park id within rides template', tripID);
    try
    {
        tripID = parseInt(tripID.tripID)
    }
    catch(e)
    {
        console.log(e)
    }
    const [rideContent, setRideContent] = useState([]);

    const alphabetical = 0;
    const waitTime = 1;

    var data = localStorage.getItem('user_data')
    var parsedData = JSON.parse(data)
    const userID = parsedData.id

    var sortBy = alphabetical;

    var park;
    var trip;
    var parkID;

    var ridesData = []
    var rides = []

    const app_name = 'group-22-0b4387ea5ed6'
    const [avgWaitTimes, setAvgWaitTimes] = useState({});

    useEffect(() => {
        fetchParks()
        //fetchRides()
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

    const fetchParks = async () =>{
        try{
            const response = await fetch(buildPath('api/parks'), {
                method: 'POST' 
            });

            if (!response.ok){
                throw new Error('Error fetching parks');
            }
            const data = await response.json();
            const parsedData = extractParkInfo(data);
            setParks(parsedData);
        } catch(error){
            console.error(error);
        }
    };

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

      const extractParkInfo = (jsonData) => {
        return jsonData.flatMap((company) => company.parks.map((park) =>({
            id: park.id,
            name : park.name
        })));
    };

    const fetchRides = async event => {
        try {    
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
            console.log("tripID: ", tripID)
            const trips = extractTripInfo(data)
            trip = await trips.find(object => object[1] === tripID)
            var rideIDs = trip[3]
            parkID = trip[2]
            park = await parks.find(object => object.id === trip[2])
            var obj = {parkID:trip[2]};
            var js = JSON.stringify(obj);
    
            const response2 = await fetch(buildPath('api/rides'), {headers:{'Content-Type': 'application/json'}, body:js, method: 'POST'});
            console.log(`response status is ${response.status}`);
            const mediaType2 = response.headers.get('content-type');
            let data2;
            if (mediaType.includes('json')) {
                data2 = await response2.json();
            } else {
                data2 = await response2.text();
            }
            console.log(data2);
            var ridesData2 = data2;
            var rides2 = extractRideInfo(ridesData2);
            for (let rideID of rideIDs) {
                for (let ride of rides2) {
                    if (ride.id === rideID && !rides.some(existingRide => existingRide.id === rideID)) {
                        rides.push(ride);
                        break;
                    }
                }
            }
            console.log(rides)
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
    
    const deleteFromTrip = async (rideID) => 
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
            const response = await fetch(buildPath('api/deleteRide'),{
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
            rides = rides.filter(ride => ride.id !== rideID);
            const avgWaitTimes = await fetchAverageWaitTimes(rides); 
            createRideButtons(avgWaitTimes)
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
                   <div>
                        <button onClick={() => deleteFromTrip(ride.id)}>Delete</button>
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


        <main className="frame" style={{ display: 'flex', flexDirection: 'column', height: 'calc(-45px + 100vh)', width: '100vw'}}>
             <div style={{ flex: '1', overflowY: 'auto' }}>
                 <div className="saved-section">
                     <div id="saved-title">
                        <h3>Saved Rides</h3>
                      </div>
                      <div className="borderBttmTrip"></div>
                    </div>
           

                 <div id='rides'>
                    {/*<label htmlFor="sortBy">Sort by:</label>
                    <select id="sortBy" name="sortBy" onChange={() => sortRides()}>
                          <option value={alphabetical}>Alphabetical</option>
                         <option value={waitTime}>Wait Time</option>
                      </select>*/}
                    {rideContent}
                    </div>
                </div>
            </main>
     </>
    );
}

export default TripsTemplate;