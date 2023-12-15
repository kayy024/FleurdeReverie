const app = require("../index");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const stripe = require("stripe")(
  "sk_test_51ONTvDAUzJ4954VmKi6jkUlOcvPM29SlryjApDarq5oowNUgRiR0iiD0108AS7GN0j1BxEZQzhnX0FRy6CApM1KD00T5Vxlkh1"
);

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

  const getUserByEmail = async (email) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE email = ?";
      db.query(query, [email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      });
    });
  };

  app.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await getUserByEmail(email);

      if (!user) {
        return res.status(401).send("Invalid email or password");
      }

      const passwordMatch = await bcrypt.compare(
        password,
        user.hashed_password
      );

      if (!passwordMatch) {
        return res.status(401).send("Invalid email or password");
      }

      // Authentication successful
      req.session.user = user;
      res.redirect("/account");
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.post("/registered", (req, res) => {
    const plainPassword = req.body.password;

    bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
      if (err) {
        console.error("Error hashing password:", err);
        return res.status(500).send("Internal Server Error");
      }

      const user = {
        username: req.body.username,
        first: req.body.first,
        last: req.body.last,
        email: req.body.email,
        hashedPassword: hashedPassword,
      };

      const query = "INSERT INTO users SET ?";
      db.query(query, user, (err, result) => {
        if (err) {
          console.error("Error storing user:", err);
          return res.status(500).send("Internal Server Error");
        }

        let resultMsg =
          "Hello " +
          req.body.first +
          " " +
          req.body.last +
          " you are now registered! We will send an email to you at " +
          req.body.email;
        resultMsg +=
          " Your password is: " +
          req.body.password +
          " and your hashed password is: " +
          hashedPassword;

        res.send(resultMsg);
      });
    });
  });

  app.get("/listusers", (req, res) => {
    const query = "SELECT username, first, last, email FROM users";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).send("Internal Server Error");
      }

      res.render("listusers.ejs", { users: results });
    });
  });

  app.get("/login", (req, res) => {
    res.render("login.ejs");
  });

  app.post("/loggedin", (req, res) => {
    const username = req.body.username;

    const query = "SELECT hashedPassword FROM users WHERE username = ?";
    db.query(query, [username], (err, results) => {
      if (err) {
        console.error("Error fetching hashed password:", err);
        return res.status(500).send("Internal Server Error");
      }

      if (results.length === 0) {
        return res.send("User not found");
      }

      const hashedPassword = results[0].hashedPassword;

      bcrypt.compare(req.body.password, hashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).send("Internal Server Error");
        }

        if (result) {
          res.send("Login successful!");
        } else {
          res.send("Incorrect password");
        }
      });
    });
  });

  const storeUser = async (firstname, surname, email, hashedPassword) => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO users (firstname, surname, email, hashed_password) VALUES (?, ?, ?, ?)";
      db.query(
        query,
        [firstname, surname, email, hashedPassword],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  };
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    } else {
      res.redirect("/login");
    }
  };

  //route for account page with authentication
  app.get("/account", isAuthenticated, (req, res) => {
    const user = req.session.user;

    if (user) {
      const userEmail = user.email;

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

  app.get("/checkout", function (req, res) {
    res.render("checkout.ejs", {});
  });

  app.post("/process-payment", async (req, res) => {
    try {
      const { token, amount } = req.body;

      const charge = await stripe.charges.create({
        amount: amount * 100,
        currency: "usd",
        source: token,
        description: "Payment for Fleur De R&eacute;verie",
      });

      console.log(charge);

      res.status(200).json({ message: "Payment processed successfully!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error processing payment." });
    }
  });
};
