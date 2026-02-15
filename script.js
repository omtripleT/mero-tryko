// ===== PRODUCT PAGE CART SCRIPT =====
const buttons = document.querySelectorAll(".buy-btn");
const cartBtn = document.getElementById("cart-btn");

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count
// function updateCartCount() {
//   const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
//   cartBtn.textContent = `Cart (${totalQuantity})`;
// }
function updateCartCount() {
  const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> (${totalQuantity})`;
}


// Save cart and notify other scripts
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  document.dispatchEvent(new CustomEvent("cartUpdated", { detail: cart }));
}

// Initialize count
updateCartCount();

// Add product to cart
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseInt(button.dataset.price);

    const existing = cart.find(item => item.name === name);
    if(existing){
      existing.quantity += 1;
    } else {
      cart.push({ name, price, quantity: 1 });
    }

    saveCart();
    alert(`✅ Added ${name} to cart!`);
  });
});

// Navigate to cart page
function goToCart(){
  window.location.href = "cart.html";
}

// Sync cart if updated elsewhere
document.addEventListener("cartUpdated", (e) => {
  cart = e.detail;
  updateCartCount();
});




//for message area

// ===== STAR RATING =====
const stars = document.querySelectorAll(".rating span");
const ratingValue = document.getElementById("rating-value");

if(stars.length > 0){
    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            const value = star.dataset.value;
            ratingValue.value = value;

            stars.forEach(s => s.classList.remove("active"));

            for(let i = 0; i < value; i++){
                stars[i].classList.add("active");
            }
        });
    });
}

// ===== FORM SUCCESS MESSAGE =====
const messageForm = document.getElementById("message-form");
const successMessage = document.getElementById("success-message");

if(messageForm){
    messageForm.addEventListener("submit", function(){
        setTimeout(() => {
            messageForm.reset();
            successMessage.style.display = "block";
        }, 1000);
    });
}
