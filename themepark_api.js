const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse JSON in request body
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
