module.exports = function (app) {
  // Handle the routes
  app.get("/", (req, res) => {
    res.render("index", { body: "Welcome to Fleur de Réviere" });
  });

  app.get("/flowers", (req, res) => {
    res.render("flowers.ejs", {});
  });

  app.get("/occasions", (req, res) => {
    const selectedOccasion = req.query.occasion || null;
    res.render("occasions.ejs", { selectedOccasion });
  });

  app.get("/basket", (req, res) => {
    res.render("basket.ejs", {});
  });

  app.get("/login", (req, res) => {
    res.render("login.ejs", {});
  });

  app.get("/register", (req, res) => {
    res.render("register.ejs", {});
  });

  app.get("/logout", (req, res) => {
    res.redirect("/");
  });

  app.get("/subscription.ejs", (req, res) => {
    res.render("subscription", {});
  });

  // Client-side JavaScript logic
  app.get("/basket", (req, res) => {
    // Function to redirect to the basket page
    function redirectToBasket() {
      window.location.href = "/basket";
    }

    // Attach click event to basket image
    res.render("index", { body: "Welcome to Fleur de Réviere" });
    res.send("<script src='/js/client.js'></script>");
  });
};

// const app = require("../index");
