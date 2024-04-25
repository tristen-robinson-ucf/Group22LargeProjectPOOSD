import { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';

function TripCard({ trip, deleteTrip, seeTripDetails, park }) {
    //ensure the trip card saves its selected color according to user's choice 
    const [selectedColor, setSelectedColor] = useState(() => {
        const savedColors = JSON.parse(localStorage.getItem('tripColors')) || {};
        return savedColors[trip] || '#9B9B9B'; 
    });
    const [showColorPicker, setShowColorPicker] = useState(false);

    //save the color
    useEffect(() => {
        const savedColors = JSON.parse(localStorage.getItem('tripColors')) || {};
        localStorage.setItem('tripColors', JSON.stringify({ ...savedColors, [trip]: selectedColor }));
    }, [trip, selectedColor]);

    const toggleColorPicker = () => {
        setShowColorPicker(!showColorPicker);
    };

    const changeColor = (color) => {
        setSelectedColor(color.hex);
    };

    return (
        <div className="parkCard">
            <div className="parkCardTop" style={{ backgroundColor: selectedColor }}>
                <button onClick={toggleColorPicker}>...</button>
            </div>
            {showColorPicker && (
                <div className="colorPickerWindow">
                    <SketchPicker
                        color={selectedColor}
                        onChange={changeColor}
                        onChangeComplete={changeColor}
                    />
                </div>
            )}
            <div className="parkCardBottom">
                <h2>{trip[0]}</h2>
                {<h3>{park}</h3>}
                <button className="waitTimeButton" onClick={() => seeTripDetails(trip)}>See Trip Details</button>
                <button className="deleteButtonTrip" onClick={() => deleteTrip(trip)}>Delete</button>
            </div>
        </div>
    );
}

export default TripCard;
