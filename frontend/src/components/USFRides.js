import React, { useState, useEffect } from 'react';

function USFRides()
{
    var rideNames = ["Illumination Theater", 
    "Hogwarts Express - King's Cross Station", 
    "Fast & Furious - Supercharged", 
    "Kang & Kodos' Twirl 'n' Hurl", 
    "MEN IN BLACK Alien Attack!", 
    "E.T. Adventure", 
    "Illumination's Villain-Con Minion Blast",
    "The Simpsons Ride",
    "Harry Potter and the Escape from Gringotts",
    "Despicable Me Minion Mayhem",
    "Hollywood Rip Ride Rockit",
    "Revenge of the Mummy",
    "TRANSFORMERS™: The Ride-3D"]

    var waitTimes = ["Open",
    "10 mins", 
    "10 mins",
    "10 mins",
    "15 mins",
    "15 mins",
    "20 mins",
    "25 mins",
    "25 mins",
    "40 mins",
    "50 mins",
    "55 mins",
    "55 mins",
    "55 mins"]

    return(
        <div className='rides'>
            {rideNames.map((rideName, index) =>
            (
                <button key={index} className='waitTimeButton'><text>{rideName}</text><b className='waitTime'>{waitTimes[index]}</b></button>
            ))}
        </div>
    )
}

export default USFRides;