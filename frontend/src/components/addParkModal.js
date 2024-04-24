import React from 'react';

//add park modal appears when user clicks add park (takes in all parks and ids)
const AddParkModal = ({ parks, setSelectedParkId, addParkSubmit, setShowAddPark }) => {
    const addParkSubmitFunc = () => {
        addParkSubmit();
        setShowAddPark(false); 
    };

    return (
        <div className="modal-overlay">
            <div className="modalContent">
                <label>Choose a Park: </label>
                <select onChange={(e) => setSelectedParkId(e.target.value)}>
                    <option value="">Select a park... </option>
                    {parks.map((park, index) => (
                        <option key={index} value={park.id}>{park.name}</option>
                    ))}
                </select>
                <button className="addParkModalBtn" onClick={addParkSubmitFunc}>Add Park</button>
                <button className="cancelParkModal" onClick={() => setShowAddPark(false)}>Close</button>
            </div>
        </div>
    );
}

export default AddParkModal;