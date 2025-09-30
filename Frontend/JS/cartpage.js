// Sample cart data
let cartItems = [
  { id: 1, name: "koko1", price: 79.99, quantity: 1, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=60" },
  { id: 2, name: "koko2", price: 129.99, quantity: 1, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=60" },
  { id: 3, name: "koko3", price: 89.99, quantity: 1, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=60" }
];

const cartContainer = document.getElementById('cart-container');
const notification = document.getElementById('notification');
const cartCount = document.querySelector('.cart-count');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');

// ✅ Notification
function showNotification(message, type = "success") {
  notification.textContent = message;
  notification.className = `notification ${type} show`;

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2500);
}

// ✅ Update totals
function updateTotals() {
  let subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 9.99 : 0;
  const tax = subtotal * 0.1;

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  shippingElement.textContent = `$${shipping.toFixed(2)}`;
  taxElement.textContent = `$${tax.toFixed(2)}`;
  totalElement.textContent = `$${(subtotal + shipping + tax).toFixed(2)}`;
}

// ✅ Update quantity (+/- or manual input)
function updateQuantity(itemId, change = 0, inputValue = null) {
  const item = cartItems.find(i => i.id === itemId);
  if (item) {
    if (inputValue !== null) {
      let val = parseInt(inputValue);
      item.quantity = isNaN(val) || val < 1 ? 1 : val;
    } else {
      item.quantity += change;
      if (item.quantity < 1) item.quantity = 1;
    }
    renderCart();
    showNotification(`Quantity updated for ${item.name}`, 'success');
  }
}

// ✅ Remove item
function removeItem(itemId) {
  cartItems = cartItems.filter(i => i.id !== itemId);
  renderCart();
  showNotification(`Item removed from cart`, 'error');
}

// ✅ Render cart
function renderCart() {
  cartContainer.innerHTML = '';

  if (cartItems.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <i class="fas fa-shopping-cart"></i>
        <h3>Your cart is empty</h3>
        <p>You haven't added any items yet.</p>
        <a href="index.html" class="shop-btn">Start Shopping</a>
      </div>
    `;
    cartCount.textContent = '0 items';
    updateTotals();
    return;
  }

  cartCount.textContent = `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'}`;

  cartItems.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="item-image"><img src="${item.image}" alt="${item.name}"></div>
      <div class="item-details">
        <h3 class="item-name">${item.name}</h3>
        <div class="item-price">$${item.price.toFixed(2)}</div>
        <div class="item-actions">
          <div class="quantity-controls">
            <button class="quantity-btn dec">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1">
            <button class="quantity-btn inc">+</button>
          </div>
          <button class="remove-btn"><i class="fas fa-trash"></i> Remove</button>
        </div>
      </div>
    `;

    // ✅ Event listeners
    cartItem.querySelector(".dec").addEventListener("click", () => updateQuantity(item.id, -1));
    cartItem.querySelector(".inc").addEventListener("click", () => updateQuantity(item.id, 1));
    cartItem.querySelector(".quantity-input").addEventListener("change", e => updateQuantity(item.id, 0, e.target.value));
    cartItem.querySelector(".remove-btn").addEventListener("click", () => removeItem(item.id));

    cartContainer.appendChild(cartItem);
  });

  updateTotals();
}

// ✅ Initialize
document.addEventListener('DOMContentLoaded', renderCart);
