import React, { useState, useEffect } from 'react';

function Landing(){
    const [parks, setParks] = useState([]);
    const [showAddPark, setShowAddPark] = useState(false);
    const [selectedParkId, setSelectedParkId] = useState('');
    const [parkContent, setParkContent] = useState('');

    const app_name = 'group-22-0b4387ea5ed6';

    function buildPath(route) {
        if (process.env.NODE_ENV === 'production') {
            return `https://${app_name}.herokuapp.com/${route}`;
        } else {
            return `http://localhost:5000/${route}`;
        }
    }

    //fetch park 
    useEffect(() => {
        fetchParks();
     }, []);

    //fetching the parks from the api
    const fetchParks = async () =>{
        try{
            const response = await fetch(buildPath('api/parks'), {
                method: 'GET', 
                headers: {
                    'Content-Type' : 'application/json'
                }
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

    const extractParkInfo = (jsonData) => {
        return jsonData.map((park) => ({
            id: park.id,
            name: park.name,
        }));
    };

    const addPark = () => {
        setShowAddPark(true);
    };

    //add a park 
    const addParkSubmit = async () => {
        if (!selectedParkId){
            console.error('No park selected');
            return;
        }

        try{
            const response = await fetch(buildPath('/api/addPark'), {
                method: 'POST', 
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({
                    userID: 'temp',  //NOT SURE
                    parkID: selectedParkId
                })
            });

            if (!response.ok){
                throw new Error ('Failed to add park');
            }

            const responseData = await response.json();
            //debug 
            console.log(responseData.message);
            fetchParks();
            setShowAddPark(false);
        }catch(error){
            console.error(error);
        }
    };

    return(
        <div id = "app">
            <div className="landing">
                <div style ={{height: '100%'}}>
                    <div className="inner-landing" style= {{width: '100vw', height: '100%', position:'relative', display: 'flex', flex: '1 1 0%', cursor: 'text' }}>
                        <div class style = {{display: 'flex', flexDirection: 'column', width: '100%', overflow:'hidden'}}>
                            <header style = {{background: 'red',  maxWidth: '100vw', userSelect:'none'}}>
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
                                            <div className= "scrollVert">
                                                {parks.map((park,index) => (
                                                    <div className ="parkCard" key={index}>
                                                        <h3>{park.name}</h3>
                                                    </div>
                                                ))}
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
                                    </div>
                                </div>
                            </main>
                         </div>    
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;