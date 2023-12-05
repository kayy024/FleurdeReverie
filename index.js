//importing modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");

const app = express();
const port = 8000;

//EJS setup
app.set("view engine", "ejs");

//Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Configurating MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "fleurs",
  password: "flower2029",
  database: "fleurderev",
});

//Connecting to database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to database");
});
global.db = db;

//css
app.use(express.static(__dirname + "/public"));

//creating a route
app.get("/", (req, res) => {
  res.send("Fleur De Réverie!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
