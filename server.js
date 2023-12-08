// server.mjs

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT;

// Use bodyParser middleware to parse JSON requests
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// Define a route for handling POST requests
app.post("/submitData", (req, res) => {
  // Access data sent in the request body
  const requestData = req.body;

  // Perform some action with the data
  console.log("Received data:", requestData);

  // Save the JSON data to a file
  saveDataToFile(requestData);

  // Send a response back to the client
  res.send("Data received and saved successfully!");
});

// Function to save JSON data to a file
const saveDataToFile = (data) => {
  const filePath = "src/user-data/folders.json"; // Specify the path and filename
  const jsonData = JSON.stringify(data, null, 2);

  // Write the JSON data to the file
  fs.writeFileSync(filePath, jsonData, "utf-8");
  console.log("Data saved to file:", filePath);
};

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
