// API Base URL
const API_BASE_URL = 'https://cartify.runasp.net/api';

// Category data
let categories = [];
let currentPage = 1;
const pageSize = 20;

// Load categories from API
async function loadCategories(page = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/Category?page=${page}&pageSize=${pageSize}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle PagedResult structure
    if (data.items || data.Items) {
      categories = data.items || data.Items || [];
    } else if (Array.isArray(data)) {
      categories = data;
    } else {
      categories = [];
    }
    
    renderCategories();
  } catch (error) {
    console.error('Error loading categories:', error);
    // Show error message to user
    const categorySection = document.querySelector('.category-section .category');
    if (categorySection) {
      categorySection.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #dc3545;">
          <p>Failed to load categories. Please try again later.</p>
          <button onclick="loadCategories()" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;">Retry</button>
        </div>
      `;
    }
  }
}

// Render categories to the page
function renderCategories() {
  const categorySection = document.querySelector('.category-section .category');
  
  if (!categorySection) {
    console.error('Category section not found');
    return;
  }
  
  if (categories.length === 0) {
    categorySection.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p>No categories found.</p>
      </div>
    `;
    return;
  }
  
  // Create a simple data URI placeholder (gray square) - using double quotes in SVG to avoid conflicts
  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect width=%22300%22 height=%22200%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-family=%22Arial%22 font-size=%2214%22%3ENo Image%3C/text%3E%3C/svg%3E';
  
  categorySection.innerHTML = categories.map(category => {
    // Use imageUrl from API (lowercase, as returned by the API)
    const imageUrl = category.imageUrl || category.ImageUrl || placeholderImage;
    const categoryName = category.categoryName || category.CategoryName || 'Category';
    const categoryId = category.categoryId || category.CategoryId;
    
    // Escape quotes in imageUrl for use in HTML attribute
    const escapedImageUrl = (imageUrl || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const escapedPlaceholder = placeholderImage.replace(/"/g, '&quot;');
    
    return `
    <div class="category-card">
      <span class="shop-now-badge">Shop Now</span>
      <a href="Sub-Category.html?categoryId=${categoryId}">
        <div class="image-wrapper">
          <img 
            src="${escapedImageUrl}" 
            alt="${categoryName.replace(/"/g, '&quot;')}" 
            onerror="this.onerror=null; this.src='${escapedPlaceholder}'"
          />
        </div>
        <div class="category-name">${categoryName}</div>
      </a>
    </div>
    `;
  }).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
});

