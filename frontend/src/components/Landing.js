import React, { useState, useEffect } from 'react';
import { useNavigate, BrowserRouter } from 'react-router-dom';
//import RidesTemplate from './RidesTemplate';
import RidesPage from '../pages/RidesPage';


function Landing(){
    const [parks, setParks] = useState([]);
    const [showAddPark, setShowAddPark] = useState(false);
    const [selectedParkId, setSelectedParkId] = useState('');
    const [parkContent, setParkContent] = useState('');
    const [savedParks, setSavedParks] = useState([]);
    const [selectedDelParkId, setSelectedDelParkId] = useState([]);
    const [selectedPark, setSelectedPark] = useState('');

    // added new variables may not use all of them
    const [trips, setTrips] = useState([]);
    const [showAddTrip, setShowAddTrip] = useState(false);
    const [selectedTripId, setSelectedTripId] = useState('');
    const [tripContent, setTripContent] = useState('');
    const [savedTrips, setSavedTrips] = useState([]);
    const [selectedDelTripId, setSelectedDelTripId] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState('');

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
    }, []);


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
            //console.log('Fetched Parks:', parsedData);
        } catch(error){
            console.error(error);
        }
    };

    // Probs dont need this
    // const fetchTrips = async () =>{
    //     try{
    //         const response = await fetch(buildTrip('api/trips'), {
    //             method: 'GET' 
    //         });

    //         if (!response.ok){
    //             throw new Error('Error fetching parks');
    //         }
    //         const data = await response.json();
    //         const parsedData = extractParkInfo(data);
    //         setParks(parsedData);
    //         //console.log('Fetched Parks:', parsedData);
    //     } catch(error){
    //         console.error(error);
    //     }
    // };

    //fetching the users SAVED parks (not all parks)
    const fetchSavedParks = async () => {
        try {
            const userDataString = localStorage.getItem('user_data');
            const userData = JSON.parse(userDataString);
            //saved parks only saved ids and not names so fetch park names and match
            const savedParks = userData.saved_parks || [];
            console.log('savedPark IDS:', userData.saved_parks);

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
            console.log(savedParkNames);
            return savedParkNames;
        } catch (error) {
            console.error ('Error fetching the saved parks: ', error);
            return undefined;
        }
    };

// Probs dont need this
    // const fetchSavedTrips = async () => {
    //     try {
    //         const userDataString = localStorage.getItem('user_data');
    //         const userData = JSON.parse(userDataString);
    //         //saved parks only saved ids and not names so fetch park names and match
    //         const savedTrips = userData.saved_trips || [];
    //         console.log('savedTrip IDS:', userData.saved_trips);

    //         const response = await fetch(buildPath('api/trip'),{
    //             method: 'GET'
    //         });

    //         if(!response.ok){
    //             throw new Error('error fetching trips');
    //         }

    //         const data = await response.json();
    //         const parsedData = extractParkInfo(data);

    //         //match the ids with their corresponding park names! 
    //         const savedTripIds = savedTrips.map (id => parseInt(id));
    //         const savedTripNames = savedTripIds.map (tripID =>{
    //             const trip = parsedData.find(t=>t.id === tripID);
    //             return trip ? trip.name : '';
    //         });

    //         //update the saved parks to store their names!
    //         setSavedTrips(savedTripNames); 
    //         console.log(savedTripNames);
    //         return savedTripNames;
    //     } catch (error) {
    //         console.error ('Error fetching the saved parks: ', error);
    //         return undefined;
    //     }
    // };



    const extractParkInfo = (jsonData) => {
        return jsonData.flatMap((company) => company.parks.map((park) =>({
            id: park.id,
            name : park.name
        })));
    };

    //ensure that the dropdown/etc is onyl displayed when set show is true 
    const addPark = () => {
        setShowAddPark(true);
    };

    //add a park (problem with refreshing)
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
            console.log(responseData.message);

            console.log('Selected Park ID:', selectedParkId);
            console.log('Parks Array:', parks);

            //uodate saved parks immediately
            const selectedPark = parks.find(park => park.id === parseInt(selectedParkId));
            if (selectedPark) {
                // Update savedParks state to include the newly added park
                setSavedParks(prevSavedParks => [...prevSavedParks, selectedPark.name]);
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

    const addTripSubmit = async () => {
        const userDataString = localStorage.getItem('user_data');
        const userData = JSON.parse(userDataString);
        const userID = userData.id;

        if (!selectedTripId){
            console.error('No trip selected');
            return;
        }

        try{
            const response = await fetch(buildPath('api/addTrip'), {
                method: 'POST', 
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    name: userData.name, 
                    startDate: userData.startDate,
                    endDate: userData.endDate,
                    userID: userID,  
                    parkID: parseInt(selectedTripId),
                    rides: userData.rides
                })
            });

            if (!response.ok){
                throw new Error ('Failed to add Trip');
            }

            const responseData = await response.json();
            //debug 
            console.log(responseData.message);

            console.log('Selected Trip ID:', selectedTripId);
            // console.log('Trips Array:', trip);
            // console.log('Rides Aray', rides);

            //uodate saved parks immediately
            const selectedPark = parks.find(park => park.id === parseInt(selectedParkId));
            if (selectedPark) {
                // Update savedParks state to include the newly added park
                setSavedParks(prevSavedParks => [...prevSavedParks, selectedPark.name]);
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


    // async function searchTrip(search){
    //     try{
    //         console.log('trip to search', search)
    //         const searchTrip = await 
            
    //         const response = await fetch('/api/searchTrip',{
    //             method: 'POST',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify({userID: userID, search: search})
    //         });
    //         const data = await response.json();
    //         console.log(data)
    //         console.log("searchTrip Function")
    //         return data;
            
    //     }catch(error){
    //         console.error(error);
    //     }
    // }

    //delete park endpoint 
    const deletePark = async (parkName) => {
        //debug
        console.log('park to delete:', parkName);
        const savedParks = await fetchSavedParks();
        console.log('savedParks before del:', savedParks);

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
    }

    // ** Not workig when tested
    // adding functionality, will work with edit trip
    async function addTrip(event){
        try{
            trip_data = document.getElementById
            const response = await fetch('/api/addTrip',{
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({name, startDate, endDate, userID, parkID})
            });
            const data = await response.json();
            console.log(data)
            console.log("AddTrip Function")
            return data;
    }catch(error){
        console.error(error);
    }

    }



    // async function deleteTrip(userID, name){
    //     try{
    //         const response = await fetch('/api/deleteTrip',{
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json'},
    //             body: JSON.stringify({userID, name})
    //         });
    //         const data = await response.json();
    //         console.log(data)
    //         console.log("DeleteTrip Function")
    //         return data;
    //     }catch(error){
    //         console.error(error);
    //     }
    // }

// deelete park will be used to edit trips to delete parks in it
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

    return(
        <div id = "app">
            <div className="landing">
                <div style ={{height: '100%'}}>
                    <div className="inner-landing" style= {{width: '100vw', height: '100%', position:'relative', display: 'flex', flex: '1 1 0%', cursor: 'text' }}>
                        <div class style = {{display: 'flex', flexDirection: 'column', width: '100%', overflow:'hidden'}}>
                            <header style = {{background:  '#f78254',  maxWidth: '100vw', userSelect:'none'}}>
                                <div class="topbar" style ={{width: '100%', maxWidth: '100vw', height: '52px', opacity: '1', transition: 'opacity 700ms ease 0s, color 700ms ease 0s', position: 'relative'}}>
                                    <div style ={{display:'flex', justifyContent: 'space-between', alignItem: 'center', overflow: 'hidden', height: '52px', paddingLeft:'12px', paddingRight:'10px', borderBottom: '1px solid'}}>
                                
                                    </div>
                                </div>
                            </header>
                            <main class ="frame" style={{display: 'flex', flexDirection:'column', height: 'calc(-45px + 100vh)'}}>
                                <div style= {{flex :'1', overflowY: 'auto'}}>
                                    <div>
                                        <section className = "saved-parks">
                                            <h2>Your Saved Parks</h2>
                                            {/* div className= "scrollVert" */}
                                            <div className="scroll">
                                                < div className ="parkCardCont">
                                                    {savedParks.map((park,index) => (
                                                        <div className ="parkCard" key={index}>
                                                            <h3>{park}</h3>
                                                            <button onClick={() => deletePark(park)}>Delete</button>
                                                            <button onClick={() => seeWaitTimes(park)}>See Wait Times</button>

                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        
                                            <div className="addPark">
                                                <button onClick={addPark}>Add Park</button>
                                                {showAddPark && (
                                                    <div>
                                                        <label>Choose a Park: </label>
                                                        <select onChange={(e) => setSelectedParkId(e.target.value)}>
                                                            <option value ="">Select a park... </option>
                                                            {parks.map((park, index) => (
                                                                <option key= {index} value={park.id}>{park.name}</option>
                                                            ))}
                                                        </select>
                                                        <button onClick={addParkSubmit}>Add Park</button>
                                                        <button onClick ={() => setShowAddPark(false)}>Close</button>
                                                    </div>
                                                )}
                                            </div>     
                                        </section>
                                        <h3>Your Planned Trips</h3>
                                        {/* Code here is test api calls */}
                                        <button onClick={addTrip}>Add trip</button>
                                        <button onClick={() => searchTrip(65,"Trip Name")}>Search Trip</button>
                                        <button onClick={deleteTrip}>Delete Trip</button>
                                        <button onClick={updateTrip}>Update Trip</button>
                                        <button onClick={() => addTripSubmit()}>addTripSubmit Trip</button>
                                        <button onClick={() => deleteTrip("Trip Name")}>Delete Trip</button>
                                        <button onClick={() => searchTrip(65,"Trip Name")}>Search Trip</button>
                                        
                                        
                                        {/* may not need to be a form, form is for  */}
                                        {/* <form>
                                            <div>
                                                <label for="trip_name">Trip Name:</label>
                                                <input type="text" id="trip_name" name="trip_name"></input>
                                            </div>
                                            <div>
                                                <label for="trip_startDate">Start Date:</label>
                                                <input type="date" id="trip_startDate" name="trip_startDate"></input>
                                            </div>
                                            <div>
                                                <label for="trip_endDate">End Date:</label>
                                                <input type="date" id="trip_endDate" name="trip_endDate"></input>
                                            </div>
                                            <input type="submit" value="Create Trip"></input>
                                        </form> */}


                                            <section className = "saved-trips">
                                            <h2>Your Saved Trips</h2>
                                            {/* div className= "scrollVert" */}
                                            <div className="scroll">
                                                < div className ="parkCardCont">
                                                    {savedParks.map((park,index) => (
                                                        <div className ="parkCard" key={index}>
                                                            <h3>{park}</h3>
                                                            <button onClick={() => deletePark(park)}>Delete</button>
                                                            <button onClick={() => seeWaitTimes(park)}>See Wait Times</button>

                                                        </div>
                                                    ))}
                                                </div>
                                            </div>   
                                        </section>
                                                    
                                        <div>
                                            {/* should I make the code below into a form....event listener vs onClick? */}
                                            <div>
                                                <label for="trip_name">Trip Name:</label>
                                                <input type="text" id="trip_name" name="trip_name" placeholder="ThemePark" required></input>
                                            </div>
                                            <div>
                                                <label for="trip_startDate">Start Date:</label>
                                                <input type="date" id="trip_startDate" name="trip_startDate"></input>
                                            </div>
                                            <div>
                                                <label for="trip_endDate">End Date:</label>
                                                <input type="date" id="trip_endDate" name="trip_endDate"></input>
                                            </div>

                                            <div className="addPark">
                                                <button onClick={addPark}>Add Park</button>
                                                {showAddPark && (
                                                    <div>
                                                        <label>Choose a Park: </label>
                                                        <select onChange={(e) => setSelectedParkId(e.target.value)}>
                                                            <option value ="">Select a park... </option>
                                                            {parks.map((park, index) => (
                                                                <option key= {index} value={park.id}>{park.name}</option>
                                                            ))}
                                                        </select>
                                                        <button onClick={addParkSubmit}>Add Park</button>
                                                        <button onClick ={() => setShowAddPark(false)}>Close</button>
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={addPark}>Future Function</button>
                                            <input id="createTrip" type="submit" onClick={addTrip} value="Create Trip"></input>
                                        
                                        </div>

                                        

                                        

                                        {/* <label for="userInput">Please enter something:</label><br>
                                        <input type="text" id="userInput" name="userInput"><br>
                                        <input type="submit" value="Submit"> */}
                                    
                                        

            
                                    </div>
                                </div>
                            </main>
                         </div>    
                    </div>
                </div>
            </div>
            {selectedParkId && <RidesPage parkID={selectedPark} />}
        </div>
    );
};

export default Landing;