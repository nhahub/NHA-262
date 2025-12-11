// Cart data - will be loaded from storage
let cartItems = [];

const cartContainer = document.getElementById('cart-container');
const notification = document.getElementById('notification');
const cartCount = document.querySelector('.cart-count');
const subtotalElement = document.getElementById('subtotal');
const shippingElement = document.getElementById('shipping');
const taxElement = document.getElementById('tax');
const totalElement = document.getElementById('total');

// ✅ Get current user ID from JWT token
function getCurrentUserId() {
  try {
    const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    if (!authData || !authData.jwt) return null;
    
    // Parse JWT to get user ID
    const base64Payload = authData.jwt.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    
    // Try different possible claim names for user ID
    return payload.sub || payload.nameid || payload.userId || payload.id || null;
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
}

// ✅ Check if remember me is enabled
function isRememberMeEnabled() {
  // If Auth exists in localStorage, remember me is enabled
  // If Auth exists in sessionStorage, remember me is disabled
  return localStorage.getItem('Auth') !== null;
}

// ✅ Get storage key for user's cart
function getCartStorageKey(userId) {
  return `cart_${userId}`;
}

// ✅ Get storage instance (localStorage or sessionStorage)
function getStorage() {
  return isRememberMeEnabled() ? localStorage : sessionStorage;
}

// ✅ Load cart from storage
function loadCartFromStorage() {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn('No user ID found, using empty cart');
    cartItems = [];
    return;
  }

  const storage = getStorage();
  const otherStorage = isRememberMeEnabled() ? sessionStorage : localStorage;
  const storageKey = getCartStorageKey(userId);
  
  // Try to load from current storage
  let storedCart = storage.getItem(storageKey);
  
  // If not found in current storage, check the other storage (migration scenario)
  if (!storedCart) {
    const otherCart = otherStorage.getItem(storageKey);
    if (otherCart) {
      // Migrate cart from other storage to current storage
      try {
        cartItems = JSON.parse(otherCart);
        storage.setItem(storageKey, otherCart);
        otherStorage.removeItem(storageKey);
        console.log(`✅ Migrated and loaded ${cartItems.length} items from ${isRememberMeEnabled() ? 'sessionStorage' : 'localStorage'} to ${isRememberMeEnabled() ? 'localStorage' : 'sessionStorage'}`);
        return;
      } catch (e) {
        console.error('Error parsing migrated cart data:', e);
        cartItems = [];
        return;
      }
    }
  }

  if (storedCart) {
    try {
      cartItems = JSON.parse(storedCart);
      console.log(`✅ Loaded ${cartItems.length} items from ${isRememberMeEnabled() ? 'localStorage' : 'sessionStorage'}`);
    } catch (e) {
      console.error('Error parsing cart data:', e);
      cartItems = [];
    }
  } else {
    cartItems = [];
  }
}

// ✅ Save cart to storage
function saveCartToStorage() {
  const userId = getCurrentUserId();
  if (!userId) {
    console.warn('No user ID found, cannot save cart');
    return;
  }

  const storage = getStorage();
  const storageKey = getCartStorageKey(userId);
  
  try {
    storage.setItem(storageKey, JSON.stringify(cartItems));
    console.log(`✅ Saved ${cartItems.length} items to ${isRememberMeEnabled() ? 'localStorage' : 'sessionStorage'}`);
  } catch (e) {
    console.error('Error saving cart data:', e);
    // If storage is full, try to clear old carts or notify user
    if (e.name === 'QuotaExceededError') {
      showNotification('Storage is full. Please clear some data.', 'error');
    }
  }
}

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
    saveCartToStorage();
    renderCart();
    showNotification(`Quantity updated for ${item.name}`, 'success');
  }
}

// ✅ Remove item
function removeItem(itemId) {
  cartItems = cartItems.filter(i => i.id !== itemId);
  saveCartToStorage();
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

// ✅ Add item to cart (can be called from other pages)
function addToCart(item) {
  const userId = getCurrentUserId();
  if (!userId) {
    showNotification('Please login to add items to cart', 'error');
    return;
  }

  const existingItem = cartItems.find(i => i.id === item.id);
  if (existingItem) {
    existingItem.quantity += item.quantity || 1;
  } else {
    cartItems.push({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity || 1,
      image: item.image || ''
    });
  }
  saveCartToStorage();
  renderCart();
  showNotification(`${item.name} added to cart`, 'success');
}

// ✅ Initialize
document.addEventListener('DOMContentLoaded', function() {
  loadCartFromStorage();
  renderCart();
});
