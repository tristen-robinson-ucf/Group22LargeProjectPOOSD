// import React from 'react';

// import IOARides from '../components/IOARides'
// import RidesTemplate from '../components/RidesTemplate';

// const IOAPage = () =>
// {

//   const closed = 1001;
//   const open = -2;
//   var testRides = 'https://queue-times.com/parks/64/queue_times.json';
//   // var testRides = [
//   //   ["Camp Jurassic", open],
//   //   ["Caro-Suess-el", 5],
//   //   ["Doctor Doom's Fearfall", 15],
//   //   ["Dudley Do-Right's Ripsaw Falls", 45],
//   //   ["Flight of the Hippogriff", 45],
//   //   ["Hagrid's Magical Creatures Motorbike Adventure", 90],
//   //   ["Harry Potter and the Forbidden Journey", 35],
//   //   ["Hogwarts Express - Hogsmeade Station", 10],
//   //   ["If I Ran The Zoo", open],
//   //   ["Jurassic Park Discovery Center", open],
//   //   ["Jurassic Park River Adventure", closed],
//   //   ["Jurassic World VelociCoaster", 100],
//   //   ["Me Ship, The Olive", open],
//   //   ["One Fish, Two Fish, Red Fish, Blue Fish", 15],
//   //   ["Popeye & Bluto's Bilge-Rat Barges", closed],
//   //   ["Pteranodon Flyers", 35],
//   //   ["Skull Island: Reign of Kong", closed],
//   //   ["Storm Force Accelatron", 5],
//   //   ["The Amazing Adventures of Spider-Man", 50],
//   //   ["The Cat in The Hat", 5],
//   //   ["The High in the Sky Seuss Trolley Train Ride!", 5],
//   //   ["The Incredible Hulk Coaster", 45]
//   // ];

//     return(
//       <div>
//        {RidesTemplate(testRides)}
//       </div>
//     );
// };

// export default IOAPage;


// import React, { useState, useEffect } from 'react';
// import RidesTemplate from '../components/RidesTemplate';

// const IOAPage = () => {
//   const [rides, setRides] = useState([]);

//   // Define the API endpoint URL as an object for better maintainability
//   const rides = {"https://queue-times.com/parks/64/queue_times.json"};

//   useEffect(() => {
//     // Fetch data from the API
//     fetch(apiEndpoints.ioa)
//       .then(response => response.json())
//       .then(data => {
//         // Extract relevant information
//         const fetchedRides = data.lands.flatMap(land => land.rides.map(ride => [ride.name, ride.wait_time]));
//         setRides(fetchedRides);
//       })
//       .catch(error => console.error("Error fetching data:", error));
//   }, []);

//   return (
//     <div>
//       {RidesTemplate(apiEndpoints)}
//     </div>
//   );
// };

// export default IOAPage;

import React, { useState, useEffect } from 'react';
import RidesTemplate from '../components/RidesTemplate';

const IOAPage = () => {
  const [rideContent, setRideContent] = useState([]);

  // Sample JSON data
  const jsonData = {
    "lands": [
      {
        "id": 275,
        "name": "Jurassic Park",
        "rides": [
          {
            "id": 6008,
            "name": "Camp Jurassic™",
            "is_open": true,
            "wait_time": 0,
            "last_updated": "2024-04-04T01:03:40.000Z"
          },
          // More ride data...
        ]
      },
      // More land data...
    ],
    "rides": []
  };

  useEffect(() => {
    // Extract relevant ride data
    const ridesData = jsonData.lands.flatMap(land => land.rides.map(ride => ({
      name: ride.name,
      wait_time: ride.wait_time,
      is_open: ride.is_open
    })));

    // Set ride data to state
    setRideContent(ridesData);
  }, []); // Empty dependency array to run effect only once when component mounts

  return (
    <div>
      {RidesTemplate(rideContent)}
    </div>
  );
};

export default IOAPage;
