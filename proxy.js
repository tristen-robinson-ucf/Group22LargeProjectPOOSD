const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 6000;

// Enable CORS
app.use(cors());

// Proxy endpoint
app.get('/alt-api', async (req, res) => {
    try {
        const response = await axios.get('https://queue-times.com' + req.url);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
});
