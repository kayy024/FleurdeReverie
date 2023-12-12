// function to redirect to basket page
function redirectToBasket() {
  window.location.href = "/basket";
}

document.addEventListener("DOMContentLoaded", function () {
  var basketImage = document.getElementById("basketImage");

  if (basketImage) {
    basketImage.addEventListener("click", redirectToBasket);
  }
});
