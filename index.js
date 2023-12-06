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
app.set("views", __dirname + "/views");
app.engine("html", ejs.renderFile);

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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// CSS
app.use(express.static(path.join(__dirname, "public")));

//Route Files
require("./routes/main")(app);
