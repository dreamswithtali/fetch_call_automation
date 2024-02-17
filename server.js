const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Middleware to log each request to the file
app.use((req, res, next) => {
  const detail = {
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    headers: req.headers,
    body: req.body,
  };

  // Convert detail object to a string to store in the file
  const detailString = JSON.stringify(detail, null, 2) + "\n\n";

  // Append the detail string to the file synchronously
  try {
    fs.appendFileSync('requests.log', detailString);
  } catch (err) {
    console.error('Failed to write request details to file', err);
  }

  next();
});

// Example routes
app.get('/', (req, res) => {
  res.send('Request Successful');
});

app.post('/data', (req, res) => {
  res.json({ message: "Data received successfully" });
});

// Route to serve the log file contents
app.get('/logs', (req, res) => {
  fs.readFile('requests.log', 'utf8', (err, data) => {
    if (err) {
      console.error('Failed to read log file', err);
      res.status(500).send('Failed to read log file');
      return;
    }
    res.send(data);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
