module.exports = function (app) {
  // Handle the routes
  app.get("/", (req, res) => {
    res.render("index", { body: "Welcome to Fleur de Réviere" });
  });

  app.get("/flowers", (req, res) => {
    db.query("SELECT * FROM products", (error, results) => {
      if (error) {
        console.error("Error fetching products from the database:", error);
        return res.status(500).send("Internal Server Error");
      }

      const products = results;

      res.render("flowers.ejs", { products });
    });
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
    res.render("index", { body: "Welcome to Fleur de Réviere" });
  });
};
