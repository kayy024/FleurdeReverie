// importing modules
const path = require("path");
var express = require("express");
var bodyParser = require("body-parser");
var ejs = require("ejs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

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

//initialising passport
app.use(passport.initialize());
app.use(passport.session());

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

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      db.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, results) => {
          if (err) {
            return done(err);
          }

          if (!results || results.length === 0) {
            return done(null, false, { message: "Incorrect email." });
          }

          const user = results[0];

          // Check if the provided password is correct
          if (password === user.password) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect password." });
          }
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.email);
});

passport.deserializeUser((email, done) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
    if (err) {
      return done(err);
    }

    if (!results || results.length === 0) {
      return done(null, false);
    }

    const user = results[0];
    return done(null, user);
  });
});

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
