const fetch = require('node-fetch');
const fs = require('fs');
const readline = require('readline');

const apiUrl = 'https://webhook.site/29b17f43-8150-4fe3-afc1-fe39ef26e2ff'; // Replace with your API endpoint
const filePath = 'C:/Users/Ashish/Desktop/fetchcallautomation/data.txt'; // Replace with the path to your file

// Create a read stream for the file
const fileStream = fs.createReadStream(filePath);

// Create a readline interface
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

// Iterate through each line and make a Fetch call
rl.on('line', line => {
  // Define the Fetch options for each line
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    },
    body: line,
  };

  // Make the Fetch call
  fetch(apiUrl, requestOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Response data for line:', line, '->', data);
    })
    .catch(error => {
      console.error('Error for line', line, '->', error.message);
    });
});

// Handle the end of the file
rl.on('close', () => {
  console.log('Finished processing the file.');
});
