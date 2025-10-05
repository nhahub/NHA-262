// profile.js
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            tabContents.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to current item
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Form submissions
    const profileForm = document.querySelector('.profile-form');
    const securityForm = document.querySelector('.security-form');
    
    //ileForm.addEventListener('submit', function(e) {
        //preventDefault();
        // Add your profile update API call here
       //howNotification('Profile updated successfully!', 'success');
   //);
    
    //curityForm.addEventListener('submit', function(e) {
        //preventDefault();
       /// Add your password change API call here
       //howNotification('Password changed successfully!', 'success');
   //);
    
    // Address management
    document.querySelector('.add-address-btn').addEventListener('click', function() {
        showAddressForm();
    });
    
    // Payment method management
    document.querySelector('.add-payment-btn').addEventListener('click', function() {
        showPaymentForm();
    });
    
    // Action buttons for addresses and payments
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.address-card, .payment-card');
            // Implement edit functionality
            showNotification('Edit functionality will be implemented', 'info');
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this item?')) {
                const card = this.closest('.address-card, .payment-card');
                card.style.opacity = '0';
                setTimeout(() => card.remove(), 300);
                showNotification('Item deleted successfully', 'success');
            }
        });
    });
    
    document.querySelectorAll('.set-default-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.address-card, .payment-card');
            // Remove default badge from all cards
            document.querySelectorAll('.default-badge').forEach(badge => {
                badge.remove();
            });
            
            // Add default badge to current card
            const header = card.querySelector('.address-header, .payment-header');
            const defaultBadge = document.createElement('span');
            defaultBadge.className = 'default-badge';
            defaultBadge.textContent = 'Default';
            header.appendChild(defaultBadge);
            
            // Remove set as default button
            this.remove();
            
            showNotification('Default setting updated', 'success');
        });
    });
    
    // Change avatar functionality
    document.querySelector('.change-avatar-btn').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.querySelector('.user-avatar img').src = e.target.result;
                    showNotification('Profile picture updated successfully!', 'success');
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    });
    
    // Notification function
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            transition: all 0.3s;
            background: ${type === 'success' ? 'var(--green-normal)' : 
                        type === 'error' ? '#e74c3c' : 
                        '#3498db'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Placeholder functions for forms
    function showAddressForm() {
        // Implement address form modal
        showNotification('Add address form will be implemented', 'info');
    }
    
    function showPaymentForm() {
        // Implement payment form modal
        showNotification('Add payment method form will be implemented', 'info');
    }
});