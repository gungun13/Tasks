const express = require('express');
const bodyParser = require('body-parser');
const { google } = require('googleapis');

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors({ origin: 'http://127.0.0.1:5500' })); // Allow your frontend origin


// Load the JSON key file
const auth = new google.auth.GoogleAuth({
  keyFile: 'C:/Users/sahil/Desktop/TASK/service-account-key.json', // Path to your service account key file
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheets details
const SHEET_ID = '1FDB4Bf-qv7bT7IiBJl7zbovAoJQrKz226HMNObQmMJM'; // Replace with your actual sheet ID
const SHEET_RANGE = 'Sheet1!A:D'; // Adjust this range based on your sheet structure

// Endpoint to handle form submission
app.post('/submit', async (req, res) => {
  const { name, email, age } = req.body; // Extract data from the request body

  if (!name || !email || !age) {
    return res.status(400).send('Invalid data'); // Validate inputs
  }

  try {
    const sheets = google.sheets({ version: 'v4', auth });

    
    const parsedAge = parseInt(age, 10);
    const status = parsedAge >= 60 ? 'Senior' : parsedAge > 0 ? 'Junior' : '';
    console.log('Calculated status:', status);

    // Append the data to the Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: SHEET_RANGE,
      valueInputOption: 'RAW',
      resource: {
        values: [[name, email, age, status]], // Calculate and append "Status"
      },
    });

    res.status(200).send('Data added successfully!');
  } catch (error) {
    console.error('Error appending data:', error);
    res.status(500).send('Failed to add data.');
  }
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html'); // Replace 'index.html' with your actual HTML file name
});

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));

