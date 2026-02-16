// ===== CART PAGE SCRIPT =====

// Get elements
const container = document.getElementById("cart-container");
const subtotalDisplay = document.getElementById("subtotal");
const deliveryDisplay = document.getElementById("delivery");
const grandTotalDisplay = document.getElementById("grand-total");

const productsField = document.getElementById("form-products");
const totalField = document.getElementById("form-total");

const orderForm = document.getElementById("google-order-form");
const submitButton = orderForm.querySelector("button");

// ===== RENDER CART =====
function renderCart() {

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    subtotalDisplay.textContent = "";
    deliveryDisplay.textContent = "";
    grandTotalDisplay.textContent = "";
    productsField.value = "";
    totalField.value = "";
    submitButton.disabled = true;
    return;
  }

  let subtotal = 0;

  cart.forEach((item, index) => {

    // Ensure price is treated as number
    const price = Number(item.price);
    const quantity = Number(item.quantity);

    subtotal += price * quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>Price: Rs ${price}</p>
      <p>Quantity: ${quantity}</p>
      <div class="cart-buttons">
        <button onclick="increase(${index})">+</button>
        <button onclick="decrease(${index})">-</button>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  // ===== DELIVERY LOGIC =====
  // FREE only if subtotal MORE THAN 399
  let deliveryCharge = subtotal > 399 ? 0 : 65;

  if (deliveryCharge === 0) {
    deliveryDisplay.textContent = "Delivery: Free 🎉🎉🎉";
    deliveryDisplay.style.color = "#3A7D44";
  } else {
    deliveryDisplay.textContent = "Delivery: Rs 65";
    deliveryDisplay.style.color = "#FF7A18";
  }

  const grandTotal = subtotal + deliveryCharge;

  subtotalDisplay.textContent = `Subtotal: Rs ${subtotal}`;
  grandTotalDisplay.textContent = `Total: Rs ${grandTotal}`;

  productsField.value = cart.map(i => `${i.name} x${i.quantity}`).join(", ");
  totalField.value = `Rs ${grandTotal}`;

  submitButton.disabled = false;
}

// ===== CART FUNCTIONS =====
function increase(i) { 
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart[i].quantity = Number(cart[i].quantity) + 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decrease(i) { 
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (Number(cart[i].quantity) > 1) {
    cart[i].quantity = Number(cart[i].quantity) - 1;
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(i) { 
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(i, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// ===== INITIAL RENDER =====
renderCart();

// ===== ORDER FORM SUBMISSION =====
orderForm.addEventListener("submit", function(e){

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  if(cart.length === 0){
    e.preventDefault();
    alert("⚠️ Cannot place order! Your cart is empty.");
    return;
  }

  const subtotal = cart.reduce((acc, i) => {
    return acc + Number(i.price) * Number(i.quantity);
  }, 0);

  // SAME DELIVERY LOGIC HERE
  const deliveryCharge = subtotal > 399 ? 0 : 65;
  const grandTotal = subtotal + deliveryCharge;

  productsField.value = cart.map(i => `${i.name} x${i.quantity}`).join(", ");
  totalField.value = `Rs ${grandTotal}`;

  e.preventDefault();

  if(confirm(`Confirm your order of total Rs ${grandTotal}?`)) {

    orderForm.submit();

    localStorage.removeItem("cart");
    renderCart();

    alert("✅ Order Confirmed! Your cart has been cleared.");

  } else {
    submitButton.disabled = false;
  }

});
