const app = require("../index");
const passport = require("passport");
const bcrypt = require("bcrypt");

module.exports = function (app) {
  app.get("/", function (req, res) {
    res.render("index.ejs", { user: req.session.user });
  });

  app.get("/flowers", function (req, res) {
    db.query("SELECT * FROM products", function (error, results) {
      if (error) {
        console.error("Error fetching products from the database:", error);
        return res.status(500).send("Internal Server Error");
      }

      const products = results;

      res.render("flowers.ejs", { products });
    });
  });

  app.get("/occasions", (req, res) => {
    const selectedOccasion = req.query.occasion;

    if (!selectedOccasion) {
      return res.render("occasions", { selectedOccasion: null, products: [] });
    }

    const query = "SELECT * FROM products WHERE occasion = ?";
    db.query(query, [selectedOccasion], (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (req.xhr || req.headers.accept.indexOf("json") > -1) {
        return res.json(results);
      } else {
        return res.render("occasions", { selectedOccasion, products: results });
      }
    });
  });

  app.get("/basket", function (req, res) {
    res.render("basket.ejs", {});
  });

  app.get("/login", function (req, res) {
    res.render("login.ejs", {});
  });
  app.post(
    "/login",
    passport.authenticate("local", {
      successRedirect: "/account", //redirecting to home
      failureRedirect: "/login", //redirect to login
      failureFlash: true,
    })
  );

  app.get("/register", function (req, res) {
    res.render("register.ejs", {});
  });
  app.post("/register", (req, res) => {
    const { FirstName, LastName, email, password } = req.body;
    //hashing password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Internal Server Error");
      }
      //users added to database
      db.query(
        "INSERT INTO users (firstname, surname, email, password) VALUES (?, ?, ?, ?)",
        [FirstName, LastName, email, password],
        (err, results) => {
          if (err) {
            console.error("Error registering user:", err);
            return res.status(500).send("Internal Server Error");
          }
          res.redirect("/login");
        }
      );
    });
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  };

  //route for account page with authentication
  app.get("/account", isAuthenticated, (req, res) => {
    if (req.isAuthenticated()) {
      const userEmail = req.user.email;
      db.query(
        "SELECT firstname FROM users WHERE email = ?",
        [userEmail],
        function (error, results) {
          if (error) {
            console.error("Error fetching user's information", error);
            return res.status(500).send("Internal Server Error");
          }
          const userName = results[0].firstname;

          res.render("account.ejs", { userName });
        }
      );
    } else {
      res.redirect("/login");
    }
  });

  app.get("/subscription", function (req, res) {
    res.render("subscription", {});
  });
};
