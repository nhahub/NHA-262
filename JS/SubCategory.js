// API Base URL
const API_BASE_URL = 'https://cartify.runasp.net/api';

// Subcategory data
let subcategories = [];
let categoryId = null;

// Get category ID from URL parameters
function getCategoryIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('categoryId');
}

// Load subcategories from API
async function loadSubcategories() {
  try {
    categoryId = getCategoryIdFromURL();
    
    // If categoryId is provided, we can filter subcategories by category
    // But the API endpoint returns all subcategories, so we'll filter client-side
    const response = await fetch(`${API_BASE_URL}/Category/subcategory`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    let allSubcategories = await response.json();
    
    // Handle array response
    if (!Array.isArray(allSubcategories)) {
      allSubcategories = [];
    }
    
    // Filter by categoryId if provided
    if (categoryId) {
      subcategories = allSubcategories.filter(sub => 
        (sub.categoryId || sub.CategoryId) == categoryId
      );
    } else {
      subcategories = allSubcategories;
    }
    
    renderSubcategories();
  } catch (error) {
    console.error('Error loading subcategories:', error);
    // Show error message to user
    const categorySection = document.querySelector('.category-section .category');
    if (categorySection) {
      categorySection.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #dc3545;">
          <p>Failed to load subcategories. Please try again later.</p>
          <button onclick="loadSubcategories()" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer;">Retry</button>
        </div>
      `;
    }
  }
}

// Render subcategories to the page
function renderSubcategories() {
  const categorySection = document.querySelector('.category-section .category');
  
  if (!categorySection) {
    console.error('Category section not found');
    return;
  }
  
  if (subcategories.length === 0) {
    categorySection.innerHTML = `
      <div style="text-align: center; padding: 2rem;">
        <p>No subcategories found.</p>
      </div>
    `;
    return;
  }
  
  // Create a simple data URI placeholder (gray square) - using double quotes in SVG to avoid conflicts
  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect width=%22300%22 height=%22200%22 fill=%22%23e0e0e0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-family=%22Arial%22 font-size=%2214%22%3ENo Image%3C/text%3E%3C/svg%3E';
  
  categorySection.innerHTML = subcategories.map(subcategory => {
    // Use imageUrl from API (lowercase, as returned by the API)
    const imageUrl = subcategory.imageUrl || subcategory.ImageUrl || placeholderImage;
    const subCategoryName = subcategory.subCategoryName || subcategory.SubCategoryName || 'Subcategory';
    const subCategoryId = subcategory.subCategoryId || subcategory.SubCategoryId;
    
    // Escape quotes in imageUrl for use in HTML attribute
    const escapedImageUrl = (imageUrl || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const escapedPlaceholder = placeholderImage.replace(/"/g, '&quot;');
    
    return `
    <div class="category-card">
      <span class="shop-now-badge">Shop Now</span>
      <a href="Products.html?subCategoryId=${subCategoryId}">
        <div class="image-wrapper">
          <img 
            src="${escapedImageUrl}" 
            alt="${subCategoryName.replace(/"/g, '&quot;')}" 
            onerror="this.onerror=null; this.src='${escapedPlaceholder}'"
          />
        </div>
        <div class="category-name">${subCategoryName}</div>
      </a>
    </div>
    `;
  }).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadSubcategories();
});

