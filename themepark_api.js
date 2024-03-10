const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse JSON in the request body
app.use(express.json());

// Endpoint to list parks with available queue times, grouped by park group
app.get('/api/parks', async (req, res) => {
  try {
    const response = await axios.get('https://queue-times.com/parks.json');
    const parksData = response.data;
    res.json(parksData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to retrieve queue times for a specific park
app.get('/api/parks/:parkId/queue_times', async (req, res) => {
  const parkId = req.params.parkId;

  try {
    const response = await axios.get(`https://queue-times.com/parks/${parkId}/queue_times.json`);
    const queueTimesData = response.data;
    res.json(queueTimesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to search for parks by name
app.get('/api/parks/search', async (req, res) => {
  const searchQuery = req.query.q; // Assuming the search query is passed as a query parameter

  try {
    const response = await axios.get('https://queue-times.com/parks.json');
    const parksData = response.data;

    // Filter parks based on the search query
    const matchingParks = parksData.filter((park) =>
      park.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    res.json(matchingParks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to add a new park
app.post('/api/parks/add', async (req, res) => {
  const newParkData = req.body; // Assuming the new park data is sent in the request body

  try {
    // Perform validation on newParkData if needed

    // Example: Check if the required fields are present
    if (!newParkData.name || !newParkData.location || !newParkData.capacity) {
      return res.status(400).json({ error: 'Incomplete data. Please provide name, location, and capacity.' });
    }

    // TODO: Add logic to persist the new park data, whether in a database or another storage mechanism

    res.status(201).json({ message: 'Park added successfully', park: newParkData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to retrieve rides for a specific park
app.get('/api/parks/:parkId/rides', async (req, res) => {
  const parkId = req.params.parkId;

  try {
    const response = await axios.get(`https://queue-times.com/parks/${parkId}/rides.json`);
    const ridesData = response.data;
    res.json(ridesData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to add a new ride to a specific park
app.post('/api/parks/:parkId/rides/add', async (req, res) => {
  const parkId = req.params.parkId;
  const newRideData = req.body; // Assuming the new ride data is sent in the request body

  try {
    // Perform validation on newRideData if needed

    // Example: Check if the required fields are present
    if (!newRideData.name || !newRideData.type) {
      return res.status(400).json({ error: 'Incomplete data. Please provide name and type for the new ride.' });
    }

    // TODO: Add logic to persist the new ride data, whether in a database or another storage mechanism

    res.status(201).json({ message: 'Ride added successfully', ride: newRideData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
