// Sample orders data
const orders = [
    {
        id: "ORD-7852",
        date: "2023-10-15",
        status: "delivered",
        total: 129.99,
        items: [
            { name: "Premium Leather Watch", price: 129.99, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=60" }
        ]
    },
    {
        id: "ORD-7841",
        date: "2023-10-10",
        status: "shipped",
        total: 209.98,
        items: [
            { name: "Classic White Sneakers", price: 79.99, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=60" },
            { name: "Designer Sunglasses", price: 59.99, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=60" },
            { name: "Wireless Earbuds", price: 69.99, image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e1?auto=format&fit=crop&w=500&q=60" }
        ]
    },
    {
        id: "ORD-7823",
        date: "2023-10-05",
        status: "processing",
        total: 89.99,
        items: [
            { name: "Wireless Bluetooth Headphones", price: 89.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=60" }
        ]
    },
    {
        id: "ORD-7798",
        date: "2023-09-28",
        status: "pending",
        total: 149.97,
        items: [
            { name: "Fitness Tracker", price: 49.99, image: "https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?auto=format&fit=crop&w=500&q=60" },
            { name: "Phone Case", price: 19.99, image: "https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=500&q=60" },
            { name: "Laptop Sleeve", price: 29.99, image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=500&q=60" },
            { name: "USB Cable", price: 9.99, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=500&q=60" }
        ]
    },
    {
        id: "ORD-7765",
        date: "2023-09-20",
        status: "cancelled",
        total: 59.99,
        items: [
            { name: "Designer Sunglasses", price: 59.99, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=60" }
        ]
    }
];

// DOM elements
const ordersContainer = document.getElementById('orders-container');
const notification = document.getElementById('notification');
const tabs = document.querySelectorAll('.tab');

// Function to show notification
function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.className = `notification ${type}`;
    }, 3000);
}

// Function to get status display text and class
function getStatusInfo(status) {
    switch(status) {
        case 'delivered': return { text: 'Delivered', class: 'status-delivered' };
        case 'shipped': return { text: 'Shipped', class: 'status-shipped' };
        case 'processing': return { text: 'Processing', class: 'status-processing' };
        case 'pending': return { text: 'Pending', class: 'status-pending' };
        case 'cancelled': return { text: 'Cancelled', class: 'status-cancelled' };
        default: return { text: 'Unknown', class: 'status-pending' };
    }
}

// Function to render orders
function renderOrders(filter = 'all') {
    ordersContainer.innerHTML = '';
    
    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'active') return ['pending', 'processing', 'shipped'].includes(order.status);
        if (filter === 'completed') return ['delivered', 'cancelled'].includes(order.status);
        return true;
    });
    
    if (filteredOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-orders">
                <i class="fas fa-box-open"></i>
                <h3>No orders found</h3>
                <p>You don't have any ${filter === 'all' ? '' : filter} orders yet.</p>
                <a href="#" class="shop-btn">Start Shopping</a>
            </div>
        `;
        return;
    }
    
    filteredOrders.forEach(order => {
        const statusInfo = getStatusInfo(order.status);
        const orderDate = new Date(order.date).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-date">Placed on ${orderDate}</div>
                </div>
                <div class="order-status ${statusInfo.class}">${statusInfo.text}</div>
            </div>
            
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <div class="item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <div class="price">$${item.price.toFixed(2)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total">Total: $${order.total.toFixed(2)}</div>
            
            <div class="order-actions">
                <button class="action-btn view-details" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
                ${order.status === 'pending' ? `
                    <button class="action-btn cancel-order" onclick="cancelOrder('${order.id}')">
                        <i class="fas fa-times"></i> Cancel Order
                    </button>
                ` : ''}
                ${order.status === 'delivered' ? `
                    <button class="action-btn reorder" onclick="reorder('${order.id}')">
                        <i class="fas fa-redo"></i> Reorder
                    </button>
                ` : ''}
                ${['processing', 'shipped'].includes(order.status) ? `
                    <button class="action-btn track-order" onclick="trackOrder('${order.id}')">
                        <i class="fas fa-shipping-fast"></i> Track Order
                    </button>
                ` : ''}
            </div>
        `;
        
        ordersContainer.appendChild(orderCard);
    });
}

// Action functions
function viewOrderDetails(orderId) {
    showNotification(`Viewing details for order ${orderId}`, 'success');
}

function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
            renderOrders(document.querySelector('.tab.active').dataset.tab);
            showNotification(`Order ${orderId} has been cancelled`, 'success');
        }
    }
}

function reorder(orderId) {
    showNotification(`Items from order ${orderId} have been added to your cart`, 'success');
}

function trackOrder(orderId) {
    showNotification(`Tracking information for order ${orderId}`, 'success');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderOrders(tab.dataset.tab);
        });
    });
});
