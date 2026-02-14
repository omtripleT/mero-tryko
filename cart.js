// ========== CART DATA ==========
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const container = document.getElementById("cart-container");
const subtotalDisplay = document.getElementById("subtotal");
const deliveryDisplay = document.getElementById("delivery");
const grandTotalDisplay = document.getElementById("grand-total");

// Form fields
const productsField = document.getElementById("form-products");
const totalField = document.getElementById("form-total");

// ========== RENDER CART ==========
function renderCart(){
  container.innerHTML = "";

  if(cart.length === 0){
    container.innerHTML = "<p>Your cart is empty.</p>";
    subtotalDisplay.textContent = "";
    deliveryDisplay.textContent = "";
    grandTotalDisplay.textContent = "";
    productsField.value = "";
    totalField.value = "";
    return;
  }

  let subtotal = 0;

  cart.forEach((item,index)=>{
    subtotal += item.price * item.quantity;

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

  // Delivery logic
  let deliveryCharge = subtotal > 399 ? 0 : 50;
  deliveryDisplay.textContent = deliveryCharge === 0 ? "Delivery: Free 🎉" : `Delivery: Rs 50`;
  deliveryDisplay.style.color = deliveryCharge === 0 ? "#3A7D44" : "#FF7A18";

  let grandTotal = subtotal + deliveryCharge;

  subtotalDisplay.textContent = `Subtotal: Rs ${subtotal}`;
  grandTotalDisplay.textContent = `Total: Rs ${grandTotal}`;

  // Update form hidden fields
  productsField.value = cart.map(i=>`${i.name} x${i.quantity}`).join(", ");
  totalField.value = `Rs ${grandTotal}`;
}

// ========== CART FUNCTIONS ==========
function increase(index){
  cart[index].quantity++;
  saveCart();
}

function decrease(index){
  if(cart[index].quantity>1) cart[index].quantity--;
  saveCart();
}

function removeItem(index){
  cart.splice(index,1);
  saveCart();
}

function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Initial render
renderCart();

// ========== ORDER FORM SUBMISSION ==========
document.getElementById("google-order-form").addEventListener("submit", function(e){
  setTimeout(()=>{
    alert("✅ Order Confirmed! Thank you.");
    localStorage.removeItem("cart");
    renderCart();
  },500);
});
