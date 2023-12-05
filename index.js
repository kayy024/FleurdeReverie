// importing modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");
const path = require("path");

const app = express();
const port = 8000;

// EJS setup
app.set("view engine", "ejs");

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Configuring MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "fleurs",
  password: "flower2029",
  database: "fleurderev",
});

// Connecting to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to the database");
});
global.db = db;

// CSS
app.use(express.static(path.join(__dirname, "public")));

// Setting up directory
app.set("views", __dirname + "/views");

app.set("view engine", "ejs");
app.engine("html", ejs.renderFile);

// Creating a route
app.get("/", (req, res) => {
  res.render("index");
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
