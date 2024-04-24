import React, { useRef, useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
import RidesPage from '../pages/RidesPage';
import AddParkModal from './addParkModal';
import { SketchPicker } from 'react-color';
import ParkCard from './parkCard';


function Landing(){
    const [parks, setParks] = useState([]);
    const [showAddPark, setShowAddPark] = useState(false);
    const [selectedParkId, setSelectedParkId] = useState('');
    const [savedParks, setSavedParks] = useState([]);
    const [selectedPark, setSelectedPark] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [searchInp, setSearchInp] = useState('');
    const [selectedColor, setSelectedColor] = useState('#000000'); 
    const [showColorPicker, setShowColorPicker] = useState(false);

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
    }, []);

    //if the user clicks anywhere else while searching it will toggle input off 
    useEffect(() => {
        const clickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowSearchBar(false);
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
        } catch(error){
            console.error(error);
        }
    };

    //fetching the users SAVED parks
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
            console.log(savedParkNames);
            return savedParkNames;
        } catch (error) {
            console.error ('Error fetching the saved parks: ', error);
            return undefined;
        }
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
            console.log(responseData.message);

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
        
    }

    //search through saved parks 
    const searchPark = async () => {
        const filteredParks = savedParks.filter(park => park.toLowerCase().includes(searchInp.toLowerCase()));
        setSearchResults(filteredParks);
    }

    //for the color selector!! (when the user wants to change the park card color )
    const toggleColorPicker = () => {
        setShowColorPicker(!showColorPicker);
    };

    const changeColor = (color) => {
        setSelectedColor(color.hex);
        setShowColorPicker(false); 
    };



    return(
        <div id = "app">
            <div className="landing">
                <div style ={{height: '100%'}}>
                    <div className="inner-landing">
                        <div class style = {{display: 'flex', flexDirection: 'column', width: '100%', overflow:'hidden'}}>
                            <header style = {{background:  '#f78254',  maxWidth: '100vw', userSelect:'none'}}>
                                <div class="topbar" style ={{width: '100%', maxWidth: '100vw', height: '32px', opacity: '1', transition: 'opacity 700ms ease 0s, color 700ms ease 0s', position: 'relative'}}>
                                    <div style ={{display:'flex', justifyContent: 'space-between', alignItem: 'center', overflow: 'hidden', height: '32px', paddingLeft:'12px', paddingRight:'10px'}}>
                                    {/* this for the top bar content */}
                                    <div className="logoutCont">
                                        <button className="logoutButton" onClick={() => logOut ()}>Logout</button>
                                    </div>
                                    </div>
                                </div>
                            </header>
                            <main class ="frame" style={{display: 'flex', flexDirection:'column', height: 'calc(-45px + 100vh)'}}>
                                <div style= {{flex :'1', overflowY: 'auto'}}>
                                    <div>
                                        <section className = "saved-parks">
                                            <div className="saved-section">
                                                <div id="saved-title">
                                                    <h3>Saved Parks</h3> 
                                                </div>
                                                <div id="title-icons">
                                                     <div className="addPark">
                                                        <button id ="addParkBtn" onClick={addPark}>Add Park</button>
                                                    </div>   
                                                    <button className="searchBtn" onClick={toggleSearchBar}>Search</button>
                                                    {showSearchBar && (
                                                        <div className="searchBar" ref={inputRef}>
                                                             <input
                                                                type="text"
                                                                value={searchInp}
                                                                onChange={(e) => 
                                                                    {
                                                                        setSearchInp(e.target.value);
                                                                        searchPark();
                                                                    }}
                                                                    placeholder="Search Park"
                                                            />
                                                       {/*} <button onClick={searchPark}>Search</button>*/}
                                                    </div>
                                                  )}  
                                                </div> 
                                                <div className="borderBttm"></div>      
                                            </div>
                                            <div className="scroll">
                                                < div className ="parkCardCont">
                                                    {(searchInp ? searchResults : savedParks).map((park,index) => (
                                                        <ParkCard
                                                            key={index}
                                                            park={park}
                                                            deletePark={deletePark}
                                                            seeWaitTimes={seeWaitTimes}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                           {/* <div className="addPark">
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
                                                            </div>*/} 
                                               
                                        </section>
                                        <h3>Your Planned Trips</h3>

                                        <section className ="plan-trip">

                                        </section>
                                    </div>
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
        </div>
    );
};

export default Landing;