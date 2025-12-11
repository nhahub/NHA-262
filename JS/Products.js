// API Base URL
const API_BASE_URL = 'https://cartify.runasp.net/api';

// Products data
let products = [];
let currentPage = 1;
const productsPerPage = 12;
let categoryId = null;
let subCategoryId = null;

// LocalStorage for cart & wishlist
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

// Get URL parameters
function getURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  categoryId = urlParams.get('categoryId');
  subCategoryId = urlParams.get('subCategoryId');
}

// Load products from API
async function loadProducts(page = 1) {
  try {
    getURLParams();
    let url = '';
    
    if (subCategoryId) {
      // Load products by subcategory
      url = `${API_BASE_URL}/Category/subcategory/${subCategoryId}/products?page=${page}&pageSize=${productsPerPage}`;
    } else if (categoryId) {
      // Load products by category
      url = `${API_BASE_URL}/Category/${categoryId}/products?page=${page}&pageSize=${productsPerPage}`;
    } else {
      // No public endpoint for all products - show message
      const productsContainer = document.getElementById("productsContainer");
      if (productsContainer) {
        productsContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
            <p>Please select a category or subcategory to view products.</p>
            <a href="Category.html" style="color: #007bff; text-decoration: underline;">Browse Categories</a>
          </div>
        `;
      }
      return;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle PagedResult structure
    if (data.items || data.Items) {
      products = data.items || data.Items || [];
      // Update pagination info if available
      if (data.totalPages) {
        // Pagination will be handled by renderProducts
      }
    } else if (Array.isArray(data)) {
      products = data;
    } else {
      products = [];
    }
    
    currentPage = page;
    renderProducts();
  } catch (error) {
    console.error('Error loading products:', error);
    const productsContainer = document.getElementById("productsContainer");
    if (productsContainer) {
      productsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; grid-column: 1 / -1; color: #dc3545;">
          <p>Failed to load products. Please try again later.</p>
          <button onclick="loadProducts(${currentPage})" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;">Retry</button>
        </div>
      `;
    }
  }
}

function renderProducts() {
  const productsContainer = document.getElementById("productsContainer");
  const pagination = document.getElementById("pagination");
  const sortSelect = document.getElementById("sort");
  
  if (!productsContainer) return;
  
  // Filter by search (if search functionality is added later)
  let filtered = [...products];
  
  // Sort
  if (sortSelect && sortSelect.value === "price") {
    // Note: ProductDto doesn't have price directly, it's in ProductDetails
    // For now, we'll sort by product name
    filtered.sort((a, b) => {
      const nameA = (a.productName || a.ProductName || '').toLowerCase();
      const nameB = (b.productName || b.ProductName || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
  } else if (sortSelect && sortSelect.value === "rating") {
    // Rating not available in ProductDto - keep original order
  }
  
  // Pagination
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const currentProducts = filtered.slice(start, end);
  
  // Render products
  if (currentProducts.length === 0) {
    productsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; grid-column: 1 / -1;">
        <p>No products found.</p>
      </div>
    `;
    pagination.innerHTML = '';
    return;
  }
  
  productsContainer.innerHTML = currentProducts.map(product => {
    const productId = product.productId || product.ProductId;
    const productName = product.productName || product.ProductName || 'Product';
    const imageUrl = product.imageUrl || product.ImageUrl || 'https://via.placeholder.com/300x200?text=Product';
    const description = product.productDescription || product.ProductDescription || '';
    
    return `
      <div class="product-card" data-id="${productId}">
        <img src="${imageUrl}" class="product-image" alt="${productName}" 
             onerror="this.src='https://via.placeholder.com/300x200?text=Product'">
        <div class="card-body">
          <h5 class="card-title">${productName}</h5>
          <p class="text-muted">${description.substring(0, 50)}${description.length > 50 ? '...' : ''}</p>
          <div class="d-flex justify-content-between align-items-center">
            <span class="price">View Details</span>
          </div>
          <div class="actions">
            <button class="btn-custom add-to-cart">Add to Cart</button>
            <button class="btn-wishlist">Add to Wishlist</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
  
  // Attach click listeners
  document.querySelectorAll(".product-card").forEach((card, idx) => {
    const productId = card.getAttribute("data-id");
    const product = currentProducts[idx];
    
    // Add to Cart
    const addToCartBtn = card.querySelector(".add-to-cart");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        // Store product info for cart
        const cartItem = {
          id: productId,
          name: product.productName || product.ProductName,
          image: product.imageUrl || product.ImageUrl,
          productId: productId
        };
        cart.push(cartItem);
        localStorage.setItem("cart", JSON.stringify(cart));
        alert(`${product.productName || product.ProductName} added to cart 🛒`);
      });
    }
    
    // Add to Wishlist
    const wishlistBtn = card.querySelector(".btn-wishlist");
    if (wishlistBtn) {
      wishlistBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const wishlistItem = {
          id: productId,
          name: product.productName || product.ProductName,
          image: product.imageUrl || product.ImageUrl,
          productId: productId
        };
        if (!wishlist.find(item => item.id == productId)) {
          wishlist.push(wishlistItem);
          localStorage.setItem("wishlist", JSON.stringify(wishlist));
          alert(`${product.productName || product.ProductName} added to wishlist ❤️`);
        } else {
          alert(`${product.productName || product.ProductName} is already in wishlist ❗`);
        }
      });
    }
    
    // Click on card (details)
    card.addEventListener("click", (e) => {
      if (!e.target.classList.contains("add-to-cart") && 
          !e.target.classList.contains("btn-wishlist") &&
          !e.target.closest(".add-to-cart") &&
          !e.target.closest(".btn-wishlist")) {
        window.location.href = `ProductsDetails.html?id=${productId}`;
      }
    });
  });
  
  // Render pagination
  const totalPages = Math.ceil(filtered.length / productsPerPage);
  if (pagination) {
    pagination.innerHTML = `
      <button ${currentPage === 1 ? "disabled" : ""} onclick="changePage(${currentPage - 1})">Prev</button>
      ${Array.from({ length: totalPages }, (_, i) =>
        `<button class="${currentPage === i + 1 ? "active" : ""}" onclick="changePage(${i + 1})">${i + 1}</button>`
      ).join("")}
      <button ${currentPage === totalPages ? "disabled" : ""} onclick="changePage(${currentPage + 1})">Next</button>
    `;
  }
}

function changePage(page) {
  currentPage = page;
  renderProducts();
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Events
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  
  const sortSelect = document.getElementById("sort");
  if (sortSelect) {
    sortSelect.addEventListener("change", () => { 
      currentPage = 1; 
      renderProducts(); 
    });
  }
});
