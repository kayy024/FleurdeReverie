// importing modules
var express = require("express");
var bodyParser = require("body-parser");
var ejs = require("ejs");

const app = express();
const port = 8000;
const mysql = require("mysql");
const session = require("express-session");
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);
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
// EJS setup
app.set("views", __dirname + "/views");

app.set("view engine", "ejs");

app.engine("html", ejs.renderFile);

//Route Files
require("./routes/main")(app);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
module.exports = app;
