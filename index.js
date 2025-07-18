// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// ================ SQL DATABASE =====================

// install mysql2 using npm install mysql2, then creating my mysql variable 
const mysql = require('mysql2');

// Create my connection to my DB
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'elk',
  password: 'd0ughnut*',
  database: 'elk_sizing'

})
connection.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to MySQL on port 3306');
});

connection.query('SELECT * FROM `info_currentp1` WHERE platform="cat4507rpluse"', (error, results) => {
  if (error) throw error;
  console.log(results);
});

// ============== END ================================


// Create an instance of an Express application
const app = express();

// Define the port the server will listen on
const PORT = 3011;

// Middleware to parse incoming JSON requests
app.use(express.json());

// TODO:  Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define the path to the JSON file
const dataFilePath = path.join(__dirname, "data.json"); //__dirname = Global variable holds the absolute path of the directory containing the current script.

// Function to read data from the JSON file
const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data); // Convert the JSON formatted string into JS object of array
};

// Function to write data to the JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// TODO: Handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.htm"));
});

// Handle GET request to retrieve stored data from the JSON file using readData, defined on line 53
app.get("/data", (req, res) => {
  const data = readData(); //Stores data from the readDate return value ()
  res.json(data); // Is a response object provided by Express, sendinng data as  JSON-formatted HTTP response to the client (browser or postname)
});

// Handle POST request to save new data with a unique ID
app.post("/data", (req, res) => {
  const newData = { id: uuidv4(), ...req.body };
  const currentData = readData();
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Data saved successfully", data: newData });
});

// Handle GET request to retrieve data by ID
app.get("/data/:id", (req, res) => {
  const data = readData();
  const item = data.find((item) => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Data not found" });
  }
  res.json(item);
});

// TODO: Handle PUT request to update data by ID
app.put("/data/:id", (req, res) => {
  const data = readData();
  const item = data.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Data not found" });
  }

  data[index] = { ...data[index], ...req.body};
  writeData(data);
  res.json({ message: "Data saved successfully", data: data[index] });
});

// TODO: Handle DELETE request to retrieve data by ID
app.delete("/data/:id", (req, res) => {
  const data = readData();
  const item = data.findIndex((item) => item.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: "Data not found" });
  }

  data.splce(index, 1);
  writeData(data);
  res.json({message: "Data deleted successfully"});
});

// Handle POST request at the /echo route
app.post("/echo", (req, res) => {
  // Respond with the same data that was received in the request body
  res.json({ received: req.body });
});


// Wildcard route to handle undefined routes
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


// =================== ADD ROOT To DB =====================
// Adding my get route to extract data from the DB
app.get('/elk', async (req, res) => {
  const platform = req.query.platform;

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM `info_currentp1` WHERE platform = ?',
      [platform]
    );

    res.json({
      message: `Results for category: ${platform}`,
      products: rows
    });
  } catch (error) {
    console.error('❌ DB error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ========================================================


