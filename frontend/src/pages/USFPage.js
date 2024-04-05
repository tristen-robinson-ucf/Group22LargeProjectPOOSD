import React from 'react';

import USFRides from '../components/USFRides'
import RidesTemplate from '../components/RidesTemplate';

const USFPage = () =>
{

  const closed = 1001;
  const open = -2;

  var rides = [
    ["Despicable Me Minion Mayhem", 40],
    ["E.T. Adventure", 15],
    ["Fast & Furious - Supercharged", 10],
    ["Harry Potter and the Escape from Gringotts", 25],
    ["Hogwarts Express - King's Cross Station", 10],
    ["Hollywood Rip Ride Rockit", 50],
    ["Illumination Theater", open],
    ["Illumination's Villain-Con Minion Blast", 20],
    ["Kang & Kodos' Twirl 'n' Hurl", 10],
    ["MEN IN BLACK Alien Attack!", 15],
    ["Revenge of the Mummy", 55],
    ["TRANSFORMERS™: The Ride-3D", 55],
    ["The Simpsons Ride", 25],
  ];
  
    return(
      <div>
        {RidesTemplate(65)}
      </div>
    );
};

export default USFPage;