import React from 'react';

import IOARides from '../components/IOARides'
import RidesTemplate from '../components/RidesTemplate';

const IOAPage = () =>
{

  const closed = 1001;
  const open = -2;

  var rides = [
    ["Camp Jurassic", open],
    ["Caro-Suess-el", 5],
    ["Doctor Doom's Fearfall", 15],
    ["Dudley Do-Right's Ripsaw Falls", 45],
    ["Flight of the Hippogriff", 45],
    ["Hagrid's Magical Creatures Motorbike Adventure", 90],
    ["Harry Potter and the Forbidden Journey", 35],
    ["Hogwarts Express - Hogsmeade Station", 10],
    ["If I Ran The Zoo", open],
    ["Jurassic Park Discovery Center", open],
    ["Jurassic Park River Adventure", closed],
    ["Jurassic World VelociCoaster", 100],
    ["Me Ship, The Olive", open],
    ["One Fish, Two Fish, Red Fish, Blue Fish", 15],
    ["Popeye & Bluto's Bilge-Rat Barges", closed],
    ["Pteranodon Flyers", 35],
    ["Skull Island: Reign of Kong", closed],
    ["Storm Force Accelatron", 5],
    ["The Amazing Adventures of Spider-Man", 50],
    ["The Cat in The Hat", 5],
    ["The High in the Sky Seuss Trolley Train Ride!", 5],
    ["The Incredible Hulk Coaster", 45]
  ];

    return(
      <div>
       {RidesTemplate(rides)}
      </div>
    );
};

export default IOAPage;