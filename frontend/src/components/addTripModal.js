import React, { useState } from 'react';

function AddTripModal({ addTripSubmit, parks, setShowAddTrip }) {
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
                        <select id="parkSelect" onChange={(e) => setSelectedParkId(e.target.value)} value={selectedParkId}>
                            <option value="">Select a park...</option>
                            {parks.map((park, index) => (
                                <option key={index} value={park.id}>{park.name}</option>
                            ))}
                        </select>
                    </div>
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
