const buttons = document.querySelectorAll(".buy-btn");
const cartBtn = document.getElementById("cart-btn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count
function updateCartCount() {
  cartBtn.textContent = `Cart (${cart.length})`;
}

updateCartCount();

buttons.forEach(button => {
  button.addEventListener("click", () => {

    const name = button.dataset.name;
    const price = parseInt(button.dataset.price);

    const existing = cart.find(item => item.name === name);

    if(existing){
      existing.quantity += 1;
    } else {
      cart.push({
        name: name,
        price: price,
        quantity: 1
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart!");
  });
});

  //cart button click.
function goToCart(){
  window.location.href = "cart.html";
}
