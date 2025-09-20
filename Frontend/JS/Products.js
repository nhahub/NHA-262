// Dummy Products
const products = Array.from({ length: 55 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 500) + 50,
  rating: Math.floor(Math.random() * 5) + 1,
  image: "https://picsum.photos/300/200?random=" + (i + 1)
}));

const productsContainer = document.getElementById("productsContainer");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

let currentPage = 1;
const productsPerPage = 12;

function renderProducts() {
  // filter by search
  let filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );

  // sort
  if (sortSelect.value === "price") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortSelect.value === "rating") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // pagination
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const currentProducts = filtered.slice(start, end);

  // render
  productsContainer.innerHTML = currentProducts.map(p => `
    <div class="product-card" data-id="${p.id}">
      <img src="${p.image}" class="product-image" alt="${p.name}">
      <div class="card-body">
        <h5 class="card-title">${p.name}</h5>
        <p class="text-muted">⭐ ${p.rating} / 5</p>
        <div class="d-flex justify-content-between align-items-center">
          <span class="price">$${p.price}</span>
          <button class="btn-custom add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join("");

  // attach click listeners
  document.querySelectorAll(".product-card").forEach(card => {
    const productId = card.getAttribute("data-id");

    card.addEventListener("click", (e) => {
      // لو الكليك على زرار Add to Cart متعملش redirect
      if (e.target.classList.contains("add-to-cart")) {
        alert(`Product ${productId} added to cart!`);
        return;
      }
      // غير كده روح على صفحة التفاصيل
      window.location.href = `ProductsDetails.html?id=${productId}`;
    });
  });

  // render pagination
  const totalPages = Math.ceil(filtered.length / productsPerPage);
  pagination.innerHTML = `
    <button ${currentPage === 1 ? "disabled" : ""} onclick="changePage(${currentPage - 1})">Prev</button>
    ${Array.from({ length: totalPages }, (_, i) =>
      `<button class="${currentPage === i + 1 ? "active" : ""}" onclick="changePage(${i + 1})">${i + 1}</button>`
    ).join("")}
    <button ${currentPage === totalPages ? "disabled" : ""} onclick="changePage(${currentPage + 1})">Next</button>
  `;
}

function changePage(page) {
  currentPage = page;
  renderProducts();
}

// events
searchInput.addEventListener("input", () => { currentPage = 1; renderProducts(); });
sortSelect.addEventListener("change", () => { currentPage = 1; renderProducts(); });

// init
renderProducts();
