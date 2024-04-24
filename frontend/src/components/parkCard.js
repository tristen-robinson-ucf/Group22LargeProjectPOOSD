import { useState, useEffect } from 'react';
import { SketchPicker } from 'react-color';

function ParkCard({ park, deletePark, seeWaitTimes }) {
    //ensure the park card saves its selected color according to user's choice 
    const [selectedColor, setSelectedColor] = useState(() => {
        const savedColors = JSON.parse(localStorage.getItem('parkColors')) || {};
        return savedColors[park] || '#9B9B9B'; 
    });
    const [showColorPicker, setShowColorPicker] = useState(false);

    //save the color
    useEffect(() => {
        const savedColors = JSON.parse(localStorage.getItem('parkColors')) || {};
        localStorage.setItem('parkColors', JSON.stringify({ ...savedColors, [park]: selectedColor }));
    }, [park, selectedColor]);

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
                <h3>{park}</h3>
                <button className="waitTimeButton" onClick={() => seeWaitTimes(park)}>See Wait Times</button>
                <button className="deleteButton" onClick={() => deletePark(park)}>Delete</button>
            </div>
        </div>
    );
}

export default ParkCard;
