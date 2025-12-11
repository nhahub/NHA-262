// API Base URL
const API_BASE_URL = 'https://cartify.runasp.net/api';

// Product data
let product = null;
let productId = null;

// Get product ID from URL parameters
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Load product details from API
async function loadProductDetails() {
  try {
    productId = getProductIdFromURL();
    
    if (!productId) {
      showError('Product ID is missing from URL');
      return;
    }
    
    // NOTE: The backend endpoint /api/merchant/products/{productId} requires Merchant authentication
    // This is a limitation - there's no public endpoint for product details
    // Attempting to fetch - will fail if not authenticated
    const response = await fetch(`${API_BASE_URL}/merchant/products/${productId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
        // Note: Authorization header would be needed if user is authenticated
      }
    });
    
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        showError('Product details require authentication. Please log in as a merchant to view product details.');
        return;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    product = await response.json();
    renderProductDetails();
  } catch (error) {
    console.error('Error loading product details:', error);
    showError('Failed to load product details. This endpoint requires merchant authentication.');
  }
}

// Render product details to the page
function renderProductDetails() {
  if (!product) {
    showError('Product data not available');
    return;
  }
  
  const productTitle = document.querySelector('.product-title');
  const productImage = document.querySelector('.product-image');
  const productPrice = document.querySelector('.product-price');
  const productStock = document.querySelector('.product-stock');
  const productDescription = document.querySelector('.product-description');
  
  if (productTitle) {
    productTitle.textContent = product.productName || product.ProductName || 'Product Name';
  }
  
  if (productImage) {
    const imageUrl = product.imageUrls?.[0] || product.ImageUrls?.[0] || 
                     product.imageUrl || product.ImageUrl || 
                     'https://via.placeholder.com/500x500?text=Product';
    productImage.src = imageUrl;
    productImage.alt = product.productName || product.ProductName || 'Product';
    productImage.onerror = function() {
      this.src = 'https://via.placeholder.com/500x500?text=Product';
    };
  }
  
  // Get price from product details (first detail if available)
  let price = 'Price not available';
  if (product.productDetails && product.productDetails.length > 0) {
    const firstDetail = product.productDetails[0];
    price = `$${(firstDetail.price || firstDetail.Price || 0).toFixed(2)}`;
    if (firstDetail.priceAfterDiscount || firstDetail.PriceAfterDiscount) {
      const discountPrice = firstDetail.priceAfterDiscount || firstDetail.PriceAfterDiscount;
      price = `<span style="text-decoration: line-through; color: #999;">$${(firstDetail.price || firstDetail.Price || 0).toFixed(2)}</span> $${discountPrice.toFixed(2)}`;
    }
  }
  
  if (productPrice) {
    productPrice.innerHTML = price;
  }
  
  // Stock status
  let stockStatus = 'In Stock';
  if (product.productDetails && product.productDetails.length > 0) {
    const firstDetail = product.productDetails[0];
    const quantity = firstDetail.quantityAvailable || firstDetail.QuantityAvailable || 0;
    stockStatus = quantity > 0 ? `In Stock (${quantity} available)` : 'Out of Stock';
  }
  
  if (productStock) {
    productStock.textContent = stockStatus;
    productStock.style.color = stockStatus.includes('Out of Stock') ? '#dc3545' : '#28a745';
  }
  
  if (productDescription) {
    productDescription.textContent = product.productDescription || product.ProductDescription || 
                                      'No description available for this product.';
  }
  
  // Update product object for cart/wishlist
  product.id = productId;
  product.name = product.productName || product.ProductName;
  product.url = window.location.href;
}

// Show error message
function showError(message) {
  const productDetails = document.querySelector('.product-details');
  if (productDetails) {
    productDetails.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #dc3545;">
        <h2>⚠️ Access Restricted</h2>
        <p>${message}</p>
        <p style="margin-top: 1rem; font-size: 0.9rem; color: #666;">
          <strong>Note:</strong> The backend endpoint for product details requires Merchant authentication. 
          There is currently no public endpoint available for viewing product details.
        </p>
        <div style="margin-top: 1.5rem;">
          <a href="Products.html" style="padding: 0.5rem 1rem; background: #007bff; color: white; text-decoration: none; border-radius: 4px; display: inline-block;">
            Back to Products
          </a>
        </div>
      </div>
    `;
  }
}

// Helper: save to localStorage
function saveItem(key, item) {
  try {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    // avoid duplicates
    if (!items.some(p => p.id == item.id)) {
      items.push(item);
      localStorage.setItem(key, JSON.stringify(items));
    }
  } catch (err) {
    console.error(`❌ Error saving to ${key}:`, err);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadProductDetails();
  
  // Add to Cart button
  const addToCartBtn = document.querySelector(".btn-primary");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (product) {
        const cartItem = {
          id: product.id || productId,
          name: product.productName || product.ProductName,
          image: product.imageUrls?.[0] || product.ImageUrls?.[0] || product.imageUrl || product.ImageUrl,
          productId: productId
        };
        saveItem("cart", cartItem);
        alert(`${product.productName || product.ProductName} added to cart 🛒`);
      }
    });
  }
  
  // Add to Wishlist button
  const wishlistBtn = document.querySelector(".btn-secondary");
  if (wishlistBtn && wishlistBtn.textContent.includes("Wishlist")) {
    wishlistBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (product) {
        const wishlistItem = {
          id: product.id || productId,
          name: product.productName || product.ProductName,
          image: product.imageUrls?.[0] || product.ImageUrls?.[0] || product.imageUrl || product.ImageUrl,
          productId: productId
        };
        saveItem("wishlist", wishlistItem);
        alert(`${product.productName || product.ProductName} added to wishlist ❤️`);
      }
    });
  }
  
  // Share button
  const shareBtn = document.querySelectorAll(".btn-secondary");
  if (shareBtn.length > 1) {
    shareBtn.forEach(btn => {
      if (btn.textContent.includes("Share")) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const productUrl = window.location.href;
          navigator.clipboard.writeText(productUrl)
            .then(() => alert("🔗 Link copied: " + productUrl))
            .catch(() => alert("❌ Failed to copy link."));
        });
      }
    });
  }
  
  // Review & Rate button
  const reviewBtn = document.querySelectorAll(".btn-secondary");
  if (reviewBtn.length > 2) {
    reviewBtn.forEach(btn => {
      if (btn.textContent.includes("Review")) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const review = prompt("Write your review:");
          if (review && review.trim() !== "") {
            alert(`Thanks for your review:\n"${review}"`);
            let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
            reviews.push({ productId: productId, text: review });
            localStorage.setItem("reviews", JSON.stringify(reviews));
          }
        });
      }
    });
  }
});
