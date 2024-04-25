import React, { useState } from 'react';

function AddTripModal({ addTripSubmit, parks, setShowAddTrip, handleParkChange }) {
    const [tripName, setTripName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedParkId, setSelectedParkId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        //call add trip submit
        addTripSubmit({
            tripName,
            startDate,
            endDate,
            selectedParkId
        });
        //clear forms 
        setTripName('');
        setStartDate('');
        setEndDate('');
        setSelectedParkId('');
    };

    const handleParkSelectionChange = (e) => {
        const parkId = e.target.value;
        setSelectedParkId(parkId);
        handleParkChange(parkId); // Pass the selected park ID to the parent component
    };

    return (
        <div className="modal-overlay">
            {console.log('test addtrip modal')}
            <div className="modalContent">
                {/*<span className="close" onClick={addTripSubmit}>&times;</span>*/}
                <label>Add Trip</label>
                <form onSubmit={handleSubmit}>
                    <div className="inputCont">
                        <div id="tripInfo">Trip Name:</div >
                        <input type="text" id="trip_name" name="trip_name" value={tripName} onChange={(e) => setTripName(e.target.value)} placeholder="Trip Name" required />
                    </div>
                    <div className="inputCont">
                        <div id="tripInfo">Start Date:</div>
                        <input type="date" id="trip_startDate" name="trip_startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </div>
                    <div className="inputCont">
                        <div id="tripInfo">End Date:</div>
                        <input type="date" id="trip_endDate" name="trip_endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                    </div>
                    <div>
                        <div id="tripInfo">Choose a Park:</div>
                        <select id="parkSelect" onChange={handleParkSelectionChange} value={selectedParkId}>
                            <option value="">Select a park...</option>
                            {parks.map((park, index) => (
                                <option key={index} value={park.id}>{park.name}</option>
                            ))}
                        </select>
                    </div>
                    {/* Ride can be stored to a Json array for the parks selected, 
                    they would need to have the park ID, can use rides fetch rides and extract json from rides templates and 
                    how we process the rides and park to create a map for the rides and display it after the park has been selected*/}
                    {/* <div>
                        <div id="tripInfo">Choose a Ride:</div>
                        <select id="parkSelect" onChange={handleRideSelectionChange} value={selectedRideId}>
                            <option value="">Select a park...</option>
                            {ride.map((ride, index) => (
                                <option key={index} value={ride.id}>{ride.name}</option>
                            ))}
                        </select>
                    </div> */}

                    <div className="tripBtns">
                        <button id="createBtn" type="submit">Create Trip</button>
                        <button className="cancelParkModal" onClick={() => setShowAddTrip(false)}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTripModal;
