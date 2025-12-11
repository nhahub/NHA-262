// ordertracking.js
// API Base URL
const API_BASE_URL = 'https://cartify.runasp.net/api';

// Helper function to get auth token
function getAuthToken() {
    const authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth') || '{}');
    return authData.jwt || null;
}

// Helper function to get userId from JWT token
function getUserId() {
    const token = getAuthToken();
    if (!token) return null;
    
    try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        // JWT token uses JwtRegisteredClaimNames.Sub which maps to "sub" claim
        const userId = payload.sub || payload.nameid || payload.UserId || payload.userId;
        return userId ? (typeof userId === 'string' ? parseInt(userId) : userId) : null;
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
}

// Orders data - will be loaded from API
let orders = [];

// DOM elements - will be initialized after DOM loads
let ordersContainer;
let notification;
let tabs;

// Function to show notification
function showNotification(message, type) {
    if (!notification) {
        console.warn('Notification element not found:', message);
        return;
    }
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        if (notification) {
            notification.className = `notification ${type}`;
        }
    }, 3000);
}

// Function to get status display text and class from status ID
function getStatusInfo(statusId) {
    // Map status IDs to display text and CSS class
    // Assuming: 1=Pending, 2=Processing, 3=Shipped, 4=Delivered, 5=Cancelled
    const statusMap = {
        1: { text: 'Pending', class: 'status-pending' },
        2: { text: 'Processing', class: 'status-processing' },
        3: { text: 'Shipped', class: 'status-shipped' },
        4: { text: 'Delivered', class: 'status-delivered' },
        5: { text: 'Cancelled', class: 'status-cancelled' }
    };
    
    return statusMap[statusId] || { text: 'Unknown', class: 'status-pending' };
}

// Convert backend order to frontend format
function convertOrderToFrontendFormat(backendOrder) {
    const orderDate = new Date(backendOrder.orderDate || backendOrder.createdDate);
    const statusInfo = getStatusInfo(backendOrder.orderStatuesId);
    
    return {
        id: backendOrder.orderId,
        date: orderDate.toISOString().split('T')[0],
        status: statusInfo.text.toLowerCase(),
        statusId: backendOrder.orderStatuesId,
        total: backendOrder.grantTotal || backendOrder.totalPrice || 0,
        items: (backendOrder.tblOrderDetails || []).map(detail => ({
            name: detail.product?.productName || detail.productName || 'Product',
            price: detail.price || 0,
            quantity: detail.quantity || 1,
            image: detail.product?.productImage || detail.productImage || 'https://via.placeholder.com/100'
        }))
    };
}

// Function to render orders
function renderOrders(filter = 'all') {
    if (!ordersContainer) {
        console.error('orders-container not initialized');
        return;
    }
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
        const statusInfo = getStatusInfo(order.statusId || 1);
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
                            <div class="price">$${item.price.toFixed(2)} ${item.quantity > 1 ? `x ${item.quantity}` : ''}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="order-total">Total: $${order.total.toFixed(2)}</div>
            
            <div class="order-actions">
                <button class="action-btn view-details" onclick="viewOrderDetails('${order.id}')">
                    <i class="fas fa-eye"></i> View Details
                </button>
                ${(order.statusId === 1 || order.status === 'pending') ? `
                    <button class="action-btn cancel-order" onclick="cancelOrder('${order.id}')">
                        <i class="fas fa-times"></i> Cancel Order
                    </button>
                ` : ''}
                ${(order.statusId === 4 || order.status === 'delivered') ? `
                    <button class="action-btn reorder" onclick="reorder('${order.id}')">
                        <i class="fas fa-redo"></i> Reorder
                    </button>
                ` : ''}
                ${([2, 3].includes(order.statusId) || ['processing', 'shipped'].includes(order.status)) ? `
                    <button class="action-btn track-order" onclick="trackOrder('${order.id}')">
                        <i class="fas fa-shipping-fast"></i> Track Order
                    </button>
                ` : ''}
            </div>
        `;
        
        ordersContainer.appendChild(orderCard);
    });
}

// Load orders from API
function loadOrders() {
    const userId = getUserId();
    if (!userId) {
        showNotification('Please login to view your orders', 'error');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }

    const token = getAuthToken();
    if (!token) {
        showNotification('Authentication required', 'error');
        return;
    }

    fetch(`${API_BASE_URL}/Orderstracking/user/${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load orders');
        }
        return response.json();
    })
    .then(response => {
        // Convert backend orders to frontend format
        orders = Array.isArray(response) 
            ? response.map(convertOrderToFrontendFormat)
            : [];
        
        // Render orders
        const activeTab = document.querySelector('.tab.active');
        renderOrders(activeTab ? activeTab.dataset.tab : 'all');
    })
    .catch(error => {
        console.error('Error loading orders:', error);
        showNotification('Failed to load orders', 'error');
        // Show empty state
        orders = [];
        renderOrders('all');
    });
}

// Action functions
function viewOrderDetails(orderId) {
    const token = getAuthToken();
    if (!token) {
        showNotification('Authentication required', 'error');
        return;
    }

    fetch(`${API_BASE_URL}/Orderstracking/${orderId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to load order details');
        }
        return response.json();
    })
    .then(order => {
        // Display order details (you can create a modal or navigate to details page)
        const orderDetails = convertOrderToFrontendFormat(order);
        const detailsText = `
            Order ID: ${orderDetails.id}\n
            Date: ${new Date(orderDetails.date).toLocaleDateString()}\n
            Status: ${getStatusInfo(order.orderStatuesId).text}\n
            Total: $${orderDetails.total.toFixed(2)}\n
            Items: ${orderDetails.items.length}
        `;
        alert(detailsText);
        showNotification(`Viewing details for order ${orderId}`, 'success');
    })
    .catch(error => {
        console.error('Error loading order details:', error);
        showNotification('Failed to load order details', 'error');
    });
}

function cancelOrder(orderId) {
    if (!confirm('Are you sure you want to cancel this order?')) {
        return;
    }

    const token = getAuthToken();
    if (!token) {
        showNotification('Authentication required', 'error');
        return;
    }

    fetch(`${API_BASE_URL}/Orderstracking/${orderId}/cancel`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text || 'Failed to cancel order'); });
        }
        return response.text();
    })
    .then(response => {
        showNotification(`Order ${orderId} has been cancelled`, 'success');
        // Reload orders
        loadOrders();
    })
    .catch(error => {
        console.error('Error cancelling order:', error);
        const errorMsg = error.message || 'Failed to cancel order';
        showNotification(errorMsg, 'error');
    });
}

function reorder(orderId) {
    showNotification(`Items from order ${orderId} have been added to your cart`, 'success');
}

function trackOrder(orderId) {
    showNotification(`Tracking information for order ${orderId}`, 'success');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DOM elements
    ordersContainer = document.getElementById('orders-container');
    notification = document.getElementById('notification');
    tabs = document.querySelectorAll('.tab');
    
    // Check if required elements exist
    if (!ordersContainer) {
        console.error('orders-container element not found');
        return;
    }
    if (!notification) {
        console.error('notification element not found');
        return;
    }
    
    // Load orders from API
    loadOrders();
    
    // Setup tab switching
    if (tabs && tabs.length > 0) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                renderOrders(tab.dataset.tab);
            });
        });
    }
});
