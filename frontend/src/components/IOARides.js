import React, { useState, useEffect } from 'react';
import './css/landing.css'

function IOARides()
{
    var rideNames = ["Camp Jurassic", 
    "Caro-Suess-el", 
    "Doctor Doom's Fearfall", 
    "Dudley Do-Right's Ripsaw Falls", 
    "Flight of the Hippogriff", 
    "Hagrid's Magical Creatures Motorbike Adventure", 
    "Harry Potter and the Forbidden Journey",
    "Hogwarts Express - Hogsmeade Station",
    "If I Ran The Zoo",
    "Jurassic Park Discovery Center",
    "Jurassic Park River Adventure",
    "Jurassic World VelociCoaster",
    "Me Ship, The Olive",
    "One Fish, Two Fish, Red Fish, Blue Fish",
    "Popeye & Bluto's Bilge-Rat Barges",
    "Pteranodon Flyers",
    "Skull Island: Reign of Kong",
    "Storm Force Accelatron",
    "The Amazing Adventures of Spider-Man",
    "The Cat in The Hat",
    "The High in the Sky Seuss Trolley Train Ride!",
    "The Incredible Hulk Coaster"]

    var waitTimes = ["Open",
    "5 mins", 
    "15 mins",
    "45 mins",
    "45 mins",
    "90 mins",
    "35 mins",
    "10 mins",
    "Open",
    "Open",
    "Closed",
    "100 mins",
    "Open",
    "15 mins",
    "Closed",
    "35 mins",
    "Closed",
    "5 mins",
    "50 mins",
    "5 mins",
    "5 mins",
    "45 mins"]

    return(
        <div className='rides'>
            {rideNames.map((rideName, index) =>
            (
                <button key={index} className='waitTimeButton'><text>{rideName}</text><b className='waitTime'>{waitTimes[index]}</b></button>
            ))}
        </div>
    )
}

export default IOARides;