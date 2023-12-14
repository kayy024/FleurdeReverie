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
    const userEmail = "user@example.com";

    const query = "SELECT * FROM basket WHERE user_email = ?";
    db.query(query, [userEmail], (err, results) => {
      if (err) {
        console.error("Error fetching basket items from the database:", err);
        return res.status(500).send("Internal Server Error");
      }

      const basketItems = results;

      res.render("basket.ejs", { basketItems });
    });
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

  app.get("/about", function (req, res) {
    res.render("about.ejs", {});
  });

  app.get("/search", function (req, res) {
    let keyword = req.query.query;
    let sqlquery = "SELECT * FROM products WHERE name LIKE ?";
    let searchValue = "%" + keyword + "%";

    db.query(sqlquery, searchValue, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error searching, please try again later");
        return;
      }

      let newData = Object.assign({}, blogData, { posts: result });

      // Check for specific keywords and redirect
      if (keyword && keyword.includes("dream")) {
        res.redirect("/flower/details/3");
      } else if (keyword && keyword.includes("classic")) {
        res.redirect("/flower/details/7");
      } else if (keyword && keyword.includes("bouquet")) {
        res.redirect("/flowers");
      } else if (keyword && keyword.includes("anniversary")) {
        res.redirect("/occasions?occasion=anniversary");
      } else if (keyword && keyword.includes("birthday")) {
        res.redirect("/occasions?occasion=birthday");
      } else if (keyword && keyword.includes("wedding")) {
        res.redirect("/occasions?occasion=wedding");
      } else if (keyword && keyword.includes("thank you")) {
        res.redirect("/occasions?occasion=thankyou");
      } else if (keyword && keyword.includes("about")) {
        res.redirect("about");
      } else if (keyword && keyword.includes("basket")) {
        res.redirect("basket");
      } else if (keyword && keyword.includes("login")) {
        res.redirect("login");
      } else if (keyword && keyword.includes("register")) {
        res.redirect("register");
      } else {
        res.render("search.ejs", newData);
      }
    });
  });

  app.post("/api/add-to-basket/:productId", (req, res) => {
    const productId = req.params.productId;
    const userEmail = "user@example.com";

    db.query(
      "SELECT * FROM products WHERE id = ?",
      [productId],
      (error, results) => {
        if (error) {
          console.error("Error fetching product details:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const product = results[0];

        db.query(
          "INSERT INTO basket (user_email, product_name, quantity, price) VALUES (?, ?, ?, ?)",
          [userEmail, product.name, 1, product.price],
          (error) => {
            if (error) {
              console.error("Error adding product to basket:", error);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            console.log("Product added to basket:", productId);
            res.json({ success: true });
          }
        );
      }
    );
  });
};
