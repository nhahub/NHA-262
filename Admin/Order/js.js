   const orders = {
      "O001": {
        customer: "Ahmed Ali",
        date: "2025-09-18",
        status: "Shipped",
        items: [
          {name: "Smartphone", qty: 1, price: 300},
          {name: "Headphones", qty: 2, price: 50}
        ]
      },
      "O002": {
        customer: "Sarah Lee",
        date: "2025-09-17",
        status: "Pending",
        items: [
          {name: "Laptop", qty: 1, price: 800},
          {name: "Mouse", qty: 1, price: 25}
        ]
      }
    };

    // قراءة orderId من الرابط
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("orderId");

    const order = orders[orderId];
    const orderInfo = document.getElementById("orderInfo");
    const orderItems = document.getElementById("orderItems");
    const orderTitle = document.getElementById("orderTitle");
    const totalElement = document.getElementById("total");

    if (order) {
      orderTitle.textContent = `Order ${orderId} Details`;
      orderInfo.innerHTML = `
        <p><b>Customer:</b> ${order.customer}</p>
        <p><b>Date:</b> ${order.date}</p>
        <p><b>Status:</b> ${order.status}</p>
      `;

      let total = 0;
      order.items.forEach(item => {
        let subtotal = item.qty * item.price;
        total += subtotal;
        orderItems.innerHTML += `
          <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>$${subtotal}</td>
          </tr>`;
      });

      totalElement.textContent = `Total: $${total}`;
    } else {
      orderTitle.textContent = "Order Not Found";
    }
       const modal = document.getElementById("userModal");

    function openModal() {
      modal.style.display = "flex";
    }

    function closeModal() {
      modal.style.display = "none";
    }

    // Tabs
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabBtns.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => b.classList.remove("active"));
        tabContents.forEach(c => c.classList.remove("active"));

        btn.classList.add("active");
        tabContents[index].classList.add("active");
      });
    });

    // Close modal if clicked outside
    window.onclick = function(event) {
      if (event.target == modal) {
        closeModal();
      }
    }