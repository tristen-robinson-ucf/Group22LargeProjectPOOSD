import React, { useRef, useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import RidesPage from '../pages/RidesPage';
import AddParkModal from './addParkModal';
import AddTripModal from './addTripModal';
import { SketchPicker } from 'react-color';
import ParkCard from './parkCard';
import TripCard from './tripCard';
import RidesTemplate from './RidesTemplate';


function Landing(){
    const [parks, setParks] = useState([]);
    const [showAddPark, setShowAddPark] = useState(false);
    const [selectedParkId, setSelectedParkId] = useState('');
    const [savedParks, setSavedParks] = useState([]);
    const [selectedPark, setSelectedPark] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [showTripSearchBar, setShowTripSearchBar] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchInp, setSearchInp] = useState('');
    const [tripSearchInp, setTripSearchInp] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000'); 
    const [showColorPicker, setShowColorPicker] = useState(false);


    // added new variables may not use all of them
    const [trips, setTrips] = useState([]);
    const [showAddTrip, setShowAddTrip] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState('');
    const [tripContent, setTripContent] = useState('');
    const [savedTrips, setSavedTrips] = useState([]);
    const [selectedDelTripId, setSelectedDelTripId] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState('');
    const [isLoading, setIsLoading] = useState(true);


    const inputRef = useRef(null);
    const navigate = useNavigate();


    const app_name = 'group-22-0b4387ea5ed6';

    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return `https://${app_name}.herokuapp.com/${route}`;
        } else {
            return `http://localhost:5000/${route}`;
        }
    }

    //fetch all parks (for adding parks)
    useEffect(() => {
        fetchParks();
     }, []);

     //fetch users saved parks 
     useEffect(() => {
        if(checkIfUserIsNull() == true)
        {
            return;
        }
        fetchSavedParks();
        fetchSavedTrips();
    }, []);

    //if the user clicks anywhere else while searching it will toggle input off 
    useEffect(() => {
        const clickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSearchBar(false);
                setShowTripSearchBar(false);
            }
        };

        document.addEventListener('mousedown', clickOutside);
        return () => {
            document.removeEventListener('mousedown', clickOutside);
        };
    }, []);

    //if a user tries to access saved parks w/o having logged in
    const checkIfUserIsNull = async () =>
    {
        if(localStorage.getItem('user_data') == null)
        {
            window.location.href = '/login';
            console.log("User is NULL!");
            return true;
        }
        return false;
    }

    //fetching all the parks from the api
    const fetchParks = async () =>{
        try{
            const response = await fetch(buildPath('api/parks'), {
                method: 'GET' 
            });

            if (!response.ok){
                throw new Error('Error fetching parks');
            }
            const data = await response.json();
            const parsedData = extractParkInfo(data);
            setParks(parsedData);
            setIsLoading(false);
        } catch(error){
            console.error(error);
        }
    };

    //fetching the users SAVED parks (not all parks)

    const fetchSavedParks = async () => {
        try {
            const userDataString = localStorage.getItem('user_data');
            const userData = JSON.parse(userDataString);

            //console.log(userData)
            
            //saved parks only saved ids and not names so fetch park names and match
            const savedParks = userData.saved_parks || [];
            //console.log('savedPark IDS:', userData.saved_parks);

            const response = await fetch(buildPath('api/parks'),{
                method: 'GET'
            });

            if(!response.ok){
                throw new Error('error fetching parks');
            }

            const data = await response.json();
            const parsedData = extractParkInfo(data);

            //match the ids with their corresponding park names! 
            const savedParkIds = savedParks.map (id => parseInt(id));
            const savedParkNames = savedParkIds.map (parkID =>{
                const park = parsedData.find(p=>p.id === parkID);
                return park ? park.name : '';
            });

            //update the saved parks to store their names!
            setSavedParks(savedParkNames); 
            console.log("savedParkNames:", savedParkNames);
            return savedParkNames;
        } catch (error) {
            console.error ('Error fetching the saved parks: ', error);
            return undefined;
        }
    };

    const fetchSavedTrips = async () => {
        try {
            const userDataString = localStorage.getItem('user_data');
            const userData = JSON.parse(userDataString);
            const userID = userData.id
            //saved parks only saved ids and not names so fetch park names and match
            const savedTrips = userData.saved_trips || [];
            console.log('savedTrip IDS:', userData.saved_trips);

            const response = await fetch(buildPath('api/searchTrip'),{
                method: 'POST',
                headers: {'Content-Type' : 'application/json'},
                body: JSON.stringify({
                    search : "",
                    userID : userID
                })
            });

            if(!response.ok){
                throw new Error('error fetching trips');
            }

            const data = await response.json();
            var extractedTripInfo = extractTripInfo(data);
            
            //update the saved parks to store their names!
            setSavedTrips(extractedTripInfo); 
            console.log("extractedTripInfo: ", extractedTripInfo);
            return extractedTripInfo;
        } catch (error) {
            console.error ('Error fetching the saved parks: ', error);
            return undefined;
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

    //ensure that the dropdown/etc is only displayed when set show is true 
    const addPark = () => {
        setShowAddPark(true);
        /*
        const div = document.getElementById('trip_form');
        if (div.style.display != 'none') {
            div.style.display = 'none';
        }
        document.getElementById('parkSelect').value = '';
        */
    };

    //add a park 
    const addParkSubmit = async () => {
        const userDataString = localStorage.getItem('user_data');
        const userData = JSON.parse(userDataString);

        const userID = userData.id;

        if (!selectedParkId){
            console.error('No park selected');
            return;
        }

        try{
            const response = await fetch(buildPath('api/addPark'), {
                method: 'POST', 
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    userID: userID,  
                    parkID: parseInt(selectedParkId)
                })
            });

            if (!response.ok){
                throw new Error ('Failed to add park');
            }

            const responseData = await response.json();
            //debug 
            console.log("responseData.message: ", responseData.message);

            console.log('Selected Park ID:', selectedParkId);
            console.log('Parks Array:', parks);

            //update saved parks to include newly added park
            const selectedPark = parks.find(park => park.id === parseInt(selectedParkId));
            if (selectedPark) {
                setSavedParks(prevSavedParks => [...prevSavedParks, selectedPark.name]);
                const updatedSavedParks = [...userData.saved_parks, parseInt(selectedParkId)];
                userData.saved_parks = updatedSavedParks;
                localStorage.setItem('user_data', JSON.stringify(userData));

            } else {
                console.error('Selected park not found');
            }
            //update park list after adding a new 
            //await fetchSavedParks();

            //console.log(savedParks);
            setShowAddPark(false);
        }catch(error){
            console.error(error);
        }
    };

    const addTrip = () => {
        setShowAddTrip(!showAddTrip);
       /* const div = document.getElementById('trip_form');
        if (div.style.display === 'none') {
            div.style.display = 'block'; // Or 'flex', 'grid', etc., depending on your layout needs
        } else {
            div.style.display = 'none';
        }
        document.getElementById('parkSelect').value = ''; 
        */
    };

    var parkID;
    var tripID;
    var tripName;

    const setTripID = async (id) =>
    {
        tripID = id
    }
    const setParkID = async (id) =>
    {
        parkID = parseInt(id)
    }
    const setTripName = async (name) =>
    {
        tripName = name
    }

    useEffect(() => {
        parkID = parseInt(selectedParkId)
        
        }, [selectedParkId]); // Only re-run the effect if selectedRideId changes

    const addTripSubmit = async (ele) => {
        const userDataString = localStorage.getItem('user_data');
        const userData = JSON.parse(userDataString);
        console.log("userData: ", userData);
        const userID = userData.id;

        var addTripObj = {
            name: tripName, 
            startDate: ele.startDate,
            endDate: ele.endDate,
            userID: userID,  
            parkID: parkID
        }
        console.log(addTripObj)
        console.log(JSON.stringify(addTripObj))
        try{
            const response = await fetch(buildPath('api/addTrip'), {
                method: 'POST', 
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(addTripObj)
            });

            if (!response.ok){
                throw new Error ('Failed to add Trip');
            }

            const responseData = await response.json();
            //debug 
            console.log("responseData.message: ", responseData.message);
            
            fetchSavedTrips();
            // console.log('Trips Array:', trip);
            // console.log('Rides Aray', rides);

            //uodate saved parks immediately
            // const selectedTrip = savedTrips.find(trip => trip.tripID === parseInt(selectedTripId));
            // if (selectedTrip) {
            //     // Update savedParks state to include the newly added park
            //     setSavedParks(prevSavedParks => [...prevSavedParks, selectedTrip]);
            // } else {
            //     console.error('Selected park not found');
            // }
            //update park list after adding a new 
            //await fetchSavedParks();

            //console.log(savedParks);
            //setShowAddTrip(false);
        }catch(error){
            console.error(error);
        }
    };


    // addTrip:
    // 1. html gets userinput, like start/end dates, name of trip, name of park, etc
    // 2. addtrip is called from this html code, and it creates a json object with the userinput. this represents one visit to a park.
    // 3. addtrip needs to then add the json object to an array of json objects, where each json object, again,  represents a visit to a particular park.
    // 4. these array of json objects need to be stored somewhere, maybe on mongodb? 
    
    // Trip = array of json objects. One visit to a park = a single json object
    
    // editTrip:
    // 1. everytime a user wants to add more visits to a trip, he would click this button. this is a html step. userinput about an additional trip will be collected here, just like in addTrip
    // 2. editTrip is called from the the html code and makes a json object with the userinput. It then inserts this json object to the trip (which, if you recall, is an array of json objects).
    
    // This guide doesn't include handling how to add individual rides to each trip. Maybe this can be done by having an array within each json object with the list of all the rides the user wants to go to. The user would fill out this array through html as well.


    async function searchTrip(search){
        try{
            console.log('trip to search', search)
            //const searchTrip = await
            const userDataString = localStorage.getItem('user_data');
            const userData = JSON.parse(userDataString);
            const userID = userData.id;
            
            const response = await fetch('/api/searchTrip',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userID: userID, search: search})
            });
            const data = await response.json();
            console.log("data: ", data)
            console.log("searchTrip Function")
            return data;
            
        }catch(error){
            console.error(error);
        }
    }

    //delete park endpoint 
    const deletePark = async (parkName) => {
        const confirmation = window.confirm (`Are you sure you want to delete ${parkName}? This action cannot be undone.`);
        if (confirmation){
            //debug
            //console.log('park to delete:', parkName);
            const savedParks = await fetchSavedParks();
            //console.log('savedParks before del:', savedParks);

            //find the park to del! 
            const park = parks.find(park => park.name === parkName);
            console.log('Park info to del:', park);
            if (!park){
                console.log('Park not found');
                return;
            }

            const updatedSaved = savedParks.filter(savedPark => savedPark !== parkName);
            console.log('updatedlist:', updatedSaved);

            const userDataString = localStorage.getItem('user_data');
            const userData = JSON.parse(userDataString);
       
            const parkID = park.id;
            const updatedIDs = userData.saved_parks.filter(savedPark => savedPark != parkID)
            userData.saved_parks = updatedIDs;
            console.log(JSON.stringify(userData))
            localStorage.setItem('user_data', JSON.stringify(userData));

            try {
                //fetching and actual deletion from the endpoint 
                const response = await fetch(buildPath('api/deletePark'),{
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify({
                        userID : userData.id,
                        parkID: parseInt(parkID)
                     })
                });

                if (!response.ok){
                throw new Error('Failed to delete park');
                }

                setSavedParks(updatedSaved);
                console.log('saved parks afterDel',updatedSaved);
                //get message from response
                const responseData = await response.json();
                console.log(responseData.message);
            } catch(error){
                console.error(error);
            }
        } else {
            console.log(`Deletion of ${parkName} cancelled`);
        }
    };



 //delete trip endpoint 
 const deleteTrip = async (tripName) => {
    //debug
    console.log('trip to delete:', tripName);
    const savedTrips = await fetchSavedParks();
    console.log('savedTrips before del:', savedTrips);

    //find the trip to del! 
    const trip = trips.find(trip => trip.name === tripName);
    console.log('Trip info to del:', trip);
    if (!trip){
        console.log('Trip not found');
        return;
    }

    const updatedSaved = savedTrips.filter(savedTrip => savedTrip !== tripName);
    console.log('updatedlist:', updatedSaved);

    const userDataString = localStorage.getItem('user_data');
    const userData = JSON.parse(userDataString);
   
    const tripID = trip.id;
    const updatedIDs = userData.saved_trips.filter(savedTrip => savedTrip != tripID)
    userData.saved_trips = updatedIDs;
    console.log(JSON.stringify(userData))
    localStorage.setItem('user_data', JSON.stringify(userData));

    try {
        //fetching and actual deletion from the endpoint 
        const response = await fetch(buildPath('api/deletePark'),{
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                userID : userData.id,
                name: userData.name
            })
        });

        if (!response.ok){
            throw new Error('Failed to delete trip');
        }

        setSavedParks(updatedSaved);
        console.log('saved trip afterDel',updatedSaved);
        //get message from response
        const responseData = await response.json();
        console.log(responseData.message);
    } catch(error){
        console.error(error);
    }
};

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
        var ridesData = data;
        var rides = extractRideInfo(ridesData);

        return rides;
    }
    catch(e) {
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

const seeTripDetails = async(trip) => {
    navigate(`/trips/${trip[1]}`); 
}



    const seeWaitTimes = (parkName) => {
        const selectPark = parks.find(park => park.name === parkName); 
        const selectedPark = selectPark.id
        console.log(selectedPark);
        console.log('park to see wait list', selectPark);
        
        if (selectPark){
           setSelectedPark(selectedPark);
           console.log('waitlist park id:', selectedPark);
           console.log('selectedparkid var:', selectedPark);
           navigate(`/rides/${selectedPark}`); 
        } else{
            console.log('Park not found');
        }
    };


    const logOut = async () => {
        navigate(`/login`);
        console.log('logging user out!');
    };



    const toggleSearchBar= () => {
        setShowSearchBar(!showSearchBar);
        
    };

    const toggleTripSearchBar= () => {
        setShowTripSearchBar(!showTripSearchBar);
    }

// delete park will be used to edit trips to delete parks in it
// Will change this to edit trip
    async function updateTrip(tripID, name, startDate, endDate){
        const response = await fetch('/api/updateTrip',{
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ tripID, name, startDate, endDate})
        });
        const data = await response.json();
        console.log(data)
        console.log("updateTrip Function")
        return data;
    }
    
{/* <style>
    .form-group {
        margin-bottom: 15px;
    }

    .form-group label {
        display: block;
        margin-bottom: 5px;
    }

    .form-group select,
    .form-group input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
</style>
     */}

    //search through saved parks 
    const searchPark = async () => {
        const filteredParks = savedParks.filter(park => park.toLowerCase().includes(searchInp.toLowerCase()));
        setSearchResults(filteredParks);
    }

    const searchTrips = async () => {
        const filteredTrips = savedTrips.filter(trip => trip.toLowerCase().includes(tripSearchInp.toLowerCase()));
        setSearchResults(filteredTrips);
    }

    //for the color selector!! (when the user wants to change the park card color )
    const toggleColorPicker = () => {
        setShowColorPicker(!showColorPicker);
    };

    const changeColor = (color) => {
        setSelectedColor(color.hex);
        setShowColorPicker(false); 
    };

    return (
        <div id="app">
          <div className="landing">
            <div style={{ height: '100%' }}>
              <div className="inner-landing">
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
                  <header style={{ background: '#f78254', maxWidth: '100vw', userSelect: 'none' }}>
                    <div className="topbar" style={{ width: '100%', maxWidth: '100vw', height: '32px', opacity: '1', transition: 'opacity 700ms ease 0s, color 700ms ease 0s', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', height: '32px', paddingLeft: '12px', paddingRight: '10px' }}>
                        {/* this for the top bar content */}
                        <div className="logoutCont">
                          <button className="logoutButton" onClick={() => logOut()}>Logout</button>
                        </div>
                      </div>
                    </div>
                  </header>
                  <main className="frame" style={{ display: 'flex', flexDirection: 'column', height: 'calc(-45px + 100vh)' }}>
                    <div style={{ flex: '1', overflowY: 'auto' }}>
                      <section className="saved-parks">
                        <div className="saved-section">
                          <div id="saved-title">
                            <h3>Saved Parks</h3>
                          </div>
                          <div id="title-icons">
                            <div className="addPark">
                              <button id="addParkBtn" onClick={addPark}>Add Park</button>
                            </div>
                            <button className="searchBtn" onClick={toggleSearchBar}>Search</button>
                            {showSearchBar && (
                              <div className="searchBar" ref={inputRef}>
                                <input
                                  type="text"
                                  value={searchInp}
                                  onChange={(e) => {
                                    setSearchInp(e.target.value);
                                    searchPark();
                                  }}
                                  placeholder="Search Park"
                                />
                              </div>
                            )}
                          </div>
                          <div className="borderBttm"></div>
                        </div>
                        <div className="scroll">
                          <div className="parkCardCont">
                            {(searchInp ? searchResults : savedParks).map((park, index) => (
                              <ParkCard
                                key={index}
                                park={park}
                                deletePark={deletePark}
                                seeWaitTimes={seeWaitTimes}
                              />
                            ))}
                          </div>
                        </div>
                      </section>
      
                      <section className="saved Trips">
                        <div className="saved-section">
                          <div id="saved-title">
                            <h3>Planned Trips</h3>
                          </div>
                          <div id="title-icons">
                            <button id="addTripBtn" onClick={addTrip}>Add trip</button>
                            <button className="searchBtnTrip" onClick={toggleTripSearchBar}>Search</button>
                            {showTripSearchBar && (
                              <div className="searchBar" ref={inputRef}>
                                <input
                                  type="text"
                                  value={tripSearchInp}
                                  onChange={(e) => {
                                    setTripSearchInp(e.target.value);
                                    searchTrips();
                                  }}
                                  placeholder="Search Trip"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="borderBttm"></div>
                        <div className="scroll">
                          <div className="parkCardCont">
                            {isLoading ? (
                              <p>Loading parks...</p>
                            ) : (
                              savedTrips.map((trip, index) => (
                                <TripCard
                                  key={index}
                                  trip={trip}
                                  deleteTrip={deleteTrip}
                                  seeTripDetails={seeTripDetails}
                                  park={parks.find(park => park.id === trip[2]).name}
                                />
                              ))
                            )}
                          </div>
                        </div>
                        {/*<button onClick={toggleAddTripDiv}>Add trip</button>*/}
                        <div id='trip_form' style={{ display: 'none' }}>
                          <form id='trip_data'>
                            <div>
                              <label htmlFor="trip_name">Trip Name:</label>
                              <input type="text" id="trip_name" name="trip_name" placeholder="Trip Name" required></input>
                            </div>
                            <div>
                              <label htmlFor="trip_startDate">Start Date:</label>
                              <input type="date" id="trip_startDate" name="trip_startDate"></input>
                            </div>
                            <div>
                              <label htmlFor="trip_endDate">End Date:</label>
                              <input type="date" id="trip_endDate" name="trip_endDate"></input>
                            </div>
                            <div>
                              <label>Choose a Park: </label>
                              <select id='parkSelect' onChange={(e) => setSelectedParkId(e.target.value)}>
                                <option id='trip_park' value="">Select a park... </option>
                                {parks.map((park, index) => (
                                  <option key={index} value={park.id}>{park.name}</option>
                                ))}
                              </select>
                              <div>
                            {/* store ride in a json object and than display it */}
                              <label>Choose a Ride: </label>
                              <select id='rideSelect' onChange={(e) => setSelectedParkId(e.target.value)}>
                                <option id='trip_rides' value="">Select a ride... </option>
                                {parks.map((park, index) => (
                                  <option key={index} value={park.id}>{park.name}</option>
                                ))}
                              </select>




                              {/* <div className="parkCardCont">
                                {(searchInp ? searchResults : savedParks).map((park, index) => (
                                <ParkCard
                                    key={index}
                                    park={park}
                                    deletePark={deletePark}
                                    seeWaitTimes={seeWaitTimes}
                                />
                                ))} */}
                            </div>
                            </div>
                            <button onClick={addTripSubmit}>Create Trip</button>
                          </form>
                        </div>
                      </section>
                    </div>
                  </main>
                </div>
              </div>
            </div>
          </div>
          {selectedPark && <RidesPage parkID={selectedPark} />}
          {showAddPark && (
            <AddParkModal
              parks={parks}
              setSelectedParkId={setSelectedParkId}
              addParkSubmit={addParkSubmit}
              setShowAddPark={setShowAddPark}
            />
          )}
          {showAddTrip && (
            <AddTripModal
              addTripSubmit={addTripSubmit}
              parks={parks}
              setShowAddTrip={setShowAddTrip}
              handleParkChange={setParkID}
              handleNameChange={setTripName}
            />
          )}
        </div>
      );
      
};

export default Landing;