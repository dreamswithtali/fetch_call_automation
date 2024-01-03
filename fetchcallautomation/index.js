import fetch from 'node-fetch';
import fs from 'fs';
import readline from 'readline';

const apiUrl = 'https://webhook.site/29b17f43-8150-4fe3-afc1-fe39ef26e2ff'; // Replace with your API endpoint
const filePath = 'C:/Users/Ashish/Desktop/fetchcallautomation/data.txt'; // Replace with the path to your file

// Create a read stream for the file
const fileStream = fs.createReadStream(filePath);

// Create a readline interface
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});

// Define a function to make a Fetch call with a delay
const makeFetchCallWithDelay = (line, delay) => {
  setTimeout(() => {
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
  }, delay);
};

// Set the delay between each fetch call (in milliseconds)
const delayBetweenCalls = 5000; // Adjust as needed

// Iterate through each line and make a Fetch call with a delay
let delayCounter = 0;
rl.on('line', line => {
  makeFetchCallWithDelay(line, delayCounter * delayBetweenCalls);
  delayCounter++;
});

// Handle the end of the file
rl.on('close', () => {
  console.log('Finished processing the file.');
});
