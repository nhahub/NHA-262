// Dummy product data (in real app => dynamic)
const product = {
  id: 1,
  name: "Product Name",
  price: 99.99,
  url: window.location.href
};

// Buttons
const addToCartBtn = document.querySelector(".btn-primary");
const buyNowBtn = document.querySelector(".btn-buy");
const wishlistBtn = document.querySelector(".btn-secondary:nth-of-type(1)");
const shareBtn = document.querySelector(".btn-secondary:nth-of-type(2)");
const reviewBtn = document.querySelector(".btn-secondary:nth-of-type(3)");

// Helper: save to localStorage
function saveItem(key, item) {
  try {
    let items = JSON.parse(localStorage.getItem(key)) || [];
    // avoid duplicates
    if (!items.some(p => p.id === item.id)) {
      items.push(item);
      localStorage.setItem(key, JSON.stringify(items));
    }
  } catch (err) {
    console.error(`❌ Error saving to ${key}:`, err);
  }
}

// Add to Cart
addToCartBtn.addEventListener("click", () => {
  saveItem("cart", product);
  alert("Product added to cart!");
  window.location.href = "cartpage.html"; // redirect
});

// Buy Now
buyNowBtn.addEventListener("click", () => {
  saveItem("cart", product);
  window.location.href = "Checkout.html";
});

// Add to Wishlist
wishlistBtn.addEventListener("click", () => {
  saveItem("wishlist", product);
  alert("Product added to your wishlist!");
  window.location.href = "wishlistpage.html";
});

// Share
shareBtn.addEventListener("click", () => {
  const productUrl = `${window.location.origin}/product.html?id=${product.id}`;
  navigator.clipboard.writeText(productUrl)
    .then(() => alert("🔗 Link copied: " + productUrl))
    .catch(() => alert("❌ Failed to copy link."));
});

// Review & Rate
reviewBtn.addEventListener("click", () => {
  const review = prompt("Write your review:");
  if (review && review.trim() !== "") {
    alert(`Thanks for your review:\n"${review}"`);
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.push({ productId: product.id, text: review });
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }
});
