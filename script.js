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
