const app = require("../index");

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

  app.get("/occasions", function (req, res) {
    const selectedOccasion = req.query.occasion || null;
    res.render("occasions.ejs", { selectedOccasion });
  });

  app.get("/basket", function (req, res) {
    res.render("basket.ejs", {});
  });

  app.get("/login", function (req, res) {
    res.render("login.ejs", {});
  });

  app.get("/register", function (req, res) {
    res.render("register.ejs", {});
  });

  app.get("/logout", function (req, res) {
    res.redirect("/");
  });

  app.get("/account", function (req, res) {
    res.render("account.ejs", {});
  });

  app.get("/subscription", function (req, res) {
    res.render("subscription", {});
  });

  // Client-side JavaScript logic
  function redirectToBasket() {
    window.location.href = "/basket";
  }

  app.get("/basket", function (req, res) {
    res.render("index", { body: "Welcome to Fleur de Réviere" });
  });

  document.addEventListener("DOMContentLoaded", function () {
    var basketImage = document.getElementById("basketImage");

    if (basketImage) {
      basketImage.addEventListener("click", redirectToBasket);
    }
  });
};
