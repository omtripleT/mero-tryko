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
  // Always read the latest cart from localStorage
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
    subtotal += Number(item.price) * item.quantity; // convert to number

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>Price: Rs ${item.price}</p>
      <p>Quantity: ${item.quantity}</p>
      <div class="cart-buttons">
        <button onclick="increase(${index})">+</button>
        <button onclick="decrease(${index})">-</button>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });

  // Free delivery above Rs 399
  let deliveryCharge = subtotal > 399 ? 0 : 65;

  deliveryDisplay.textContent = deliveryCharge === 0 ? "Delivery: Free 🎉🎉🎉" : `Delivery: Rs ${deliveryCharge}`;
  deliveryDisplay.style.color = deliveryCharge === 0 ? "#3A7D44" : "#FF7A18";

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
  cart[i].quantity++;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decrease(i) { 
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[i].quantity > 1) cart[i].quantity--;
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

  // Block empty cart
  if(cart.length === 0){
    e.preventDefault();
    alert("⚠️ Cannot place order! Your cart is empty.");
    return;
  }

  // Calculate totals
  const subtotal = cart.reduce((acc, i) => acc + Number(i.price) * i.quantity, 0);
  const deliveryCharge = subtotal > 399 ? 0 : 65;
  const grandTotal = subtotal + deliveryCharge;

  // Populate hidden fields
  productsField.value = cart.map(i => `${i.name} x${i.quantity}`).join(", ");
  totalField.value = `Rs ${grandTotal}`;

  // Confirm order
  e.preventDefault(); // prevent default first
  if(confirm(`Confirm your order of total ${totalField.value}?`)) {
    // Submit to iframe (or Google form)
    orderForm.submit();

    // Clear cart
    localStorage.removeItem("cart");
    renderCart();

    alert("✅ Order Confirmed! Your cart has been cleared.");
  } else {
    submitButton.disabled = false;
  }
});

