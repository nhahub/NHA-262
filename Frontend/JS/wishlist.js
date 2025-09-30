// Helper: show notification
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.className = `notification ${type} show`;

  setTimeout(() => {
    notification.classList.remove("show");
  }, 2500);
}

// Load wishlist from localStorage
function loadWishlist() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const wishlistGrid = document.getElementById("wishlistGrid");
  const emptyWishlist = document.getElementById("emptyWishlist");
  const count = document.querySelector(".wishlist-count");

  wishlistGrid.innerHTML = "";
  count.textContent = wishlist.length;

  if (wishlist.length === 0) {
    emptyWishlist.style.display = "block";
    return;
  }
  emptyWishlist.style.display = "none";

  wishlist.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("wishlist-item");
    div.innerHTML = `
      <div class="product-image">
        <img src="https://via.placeholder.com/300x200?text=${item.name}" alt="${item.name}">
      </div>
      <div class="product-info">
        <h3 class="product-name">${item.name}</h3>
        <p class="product-price">$${item.price}</p>
        <div class="product-actions">
          <button class="move-to-cart"><i class="fas fa-shopping-cart"></i> Move to Cart</button>
          <button class="remove-item"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `;

    wishlistGrid.appendChild(div);
  });

  // Events: only for wishlistGrid children
  wishlistGrid.addEventListener("click", (e) => {
    const target = e.target.closest("button"); // يتأكد انه زرار
    if (!target) return;

    const index = [...wishlistGrid.querySelectorAll(".wishlist-item")].indexOf(
      target.closest(".wishlist-item")
    );
    if (index === -1) return;

    const item = wishlist[index];

    // Move to cart
    if (target.classList.contains("move-to-cart")) {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      if (!cart.some((p) => p.id === item.id)) {
        cart.push(item);
        localStorage.setItem("cart", JSON.stringify(cart));
        showNotification("✅ Moved to Cart!");
      } else {
        showNotification("⚠️ Already in Cart!", "error");
      }
      window.location.href = "cartpage.html"; // redirect
    }

    // Remove from wishlist
    if (target.classList.contains("remove-item")) {
      wishlist.splice(index, 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      loadWishlist();
      showNotification("🗑️ Removed from Wishlist!", "error");
    }
  });
}

// Init
document.addEventListener("DOMContentLoaded", loadWishlist);
