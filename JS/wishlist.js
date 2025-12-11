// Helper: show notification
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification ${type} show`;

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2500);
}

// API base - change if your backend runs on a different origin/port
const API_BASE_URL = window.API_BASE_URL || "https://cartify.runasp.net/api";

// Helper: get current user id from JWT stored in Auth (localStorage/sessionStorage)
function getCurrentUserId() {
  try {
    const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    if (!authData || !authData.jwt) return null;
    const base64Payload = authData.jwt.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    const userId = payload.sub || payload.nameid || payload.userId || payload.id || null;
    return userId ? (typeof userId === 'string' ? parseInt(userId) : userId) : null;
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return null;
  }
}

// Load wishlist (use backend when authenticated, otherwise fallback to localStorage)
async function loadWishlist() {
  const wishlistGrid = document.getElementById('wishlistGrid');
  const emptyWishlist = document.getElementById('emptyWishlist');
  const count = document.querySelector('.wishlist-count');

  wishlistGrid.innerHTML = '';

  const userId = getCurrentUserId();

  // If user is authenticated, try to fetch from API
  if (userId) {
    const auth = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    const token = auth.jwt;
    try {
      const res = await fetch(`${API_BASE_URL}/api/controller/products/user/${userId}/wishlist`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        credentials: 'include'
      });

      if (res.ok) {
        const items = await res.json();
        count.textContent = Array.isArray(items) ? items.length : 0;
        if (!items || items.length === 0) 
          {
          emptyWishlist.style.display = 'block';
          return;
        }
        emptyWishlist.style.display = 'none';
        renderWishlistItems(items);
        return;
      } else {
        console.warn('Failed to fetch wishlist from API, status:', res.status);
        // fallthrough to localStorage fallback
      }
    } catch (ex) {
      console.error('Error fetching wishlist from API:', ex);
      // fallthrough to localStorage fallback
    }
  }

  // Fallback: read from localStorage
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  count.textContent = wishlist.length;
  if (wishlist.length === 0) {
    emptyWishlist.style.display = 'block';
    return;
  }
  emptyWishlist.style.display = 'none';
  renderWishlistItems(wishlist);
}

// Render items and attach event handlers
function renderWishlistItems(items) {
  const wishlistGrid = document.getElementById('wishlistGrid');
  wishlistGrid.innerHTML = '';
  items.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('wishlist-item');
    const imgSrc = item.image || `https://via.placeholder.com/300x200?text=${encodeURIComponent(item.name)}`;
    const priceText = typeof item.price === 'number' ? item.price.toFixed(2) : item.price;
    div.innerHTML = `
      <div class="product-image">
        <img src="${imgSrc}" alt="${item.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${item.name}</h3>
        <p class="product-price">$${priceText}</p>
        <div class="product-actions">
          <button class="move-to-cart"><i class="fas fa-shopping-cart"></i> Move to Cart</button>
          <button class="remove-item"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;

    // Attach dataset for identification
    div.dataset.productId = item.id;
    wishlistGrid.appendChild(div);
  });

  // Single event listener for actions
  wishlistGrid.addEventListener('click', async (e) => {
    const target = e.target.closest('button');
    if (!target) return;
    const itemDiv = target.closest('.wishlist-item');
    if (!itemDiv) return;
    const productId = itemDiv.dataset.productId;

    // Move to cart (client-side behavior)
    if (target.classList.contains('move-to-cart')) {
      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      const item = items.find(i => String(i.id) === String(productId));
      if (!item) return showNotification('Item not found', 'error');
      if (!cart.some(p => String(p.id) === String(item.id))) {
        cart.push(Object.assign({}, item, { quantity: 1 }));
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification('✅ Moved to Cart!');
      } else {
        showNotification('⚠️ Already in Cart!', 'error');
      }
      window.location.href = 'cartpage.html';
      return;
    }

    // Remove from wishlist
    if (target.classList.contains('remove-item')) {
      const userId = getCurrentUserId();
      if (userId) {
        // Call backend delete
        const auth = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
        const token = auth.jwt;
        try {
          const res = await fetch(`${API_BASE_URL}/api/controller/products/user/${userId}/wishlist/${productId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            credentials: 'include'
          });
          if (res.ok) {
            showNotification('🗑️ Removed from Wishlist!', 'error');
            // remove element from DOM
            itemDiv.remove();
            // update count
            const count = document.querySelector('.wishlist-count');
            count.textContent = Math.max(0, parseInt(count.textContent || '0') - 1);
            // if empty, show empty state
            const wishlistGrid = document.getElementById('wishlistGrid');
            if (!wishlistGrid.querySelector('.wishlist-item')) {
              document.getElementById('emptyWishlist').style.display = 'block';
            }
            return;
          } else {
            const err = await res.json().catch(() => ({}));
            console.warn('Failed to remove from wishlist:', res.status, err);
            showNotification('Failed to remove from wishlist', 'error');
            return;
          }
        } catch (ex) {
          console.error('Error removing wishlist item:', ex);
          showNotification('Failed to remove item', 'error');
          return;
        }
      }

      // If not authenticated, remove from localStorage
      let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
      wishlist = wishlist.filter(w => String(w.id) !== String(productId));
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      itemDiv.remove();
      showNotification('🗑️ Removed from Wishlist!', 'error');
      const count = document.querySelector('.wishlist-count');
      count.textContent = wishlist.length;
      if (wishlist.length === 0) document.getElementById('emptyWishlist').style.display = 'block';
    }
  });
}

// Init
document.addEventListener("DOMContentLoaded", loadWishlist);
