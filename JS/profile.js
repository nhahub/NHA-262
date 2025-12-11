// profile.js
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
        // Also check for numeric string conversion since user.Id is stored as string in token
        const userId = payload.sub || payload.nameid || payload.UserId || payload.userId;
        return userId ? (typeof userId === 'string' ? parseInt(userId) : userId) : null;
    } catch (e) {
        console.error('Error parsing JWT:', e);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Load user profile data
    loadUserProfile();
    
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
    
    // Profile form submission
    const profileForm = document.querySelector('.profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            updateUserProfile();
        });
    }
    
    // Security form submission
    const securityForm = document.querySelector('.security-form');
    if (securityForm) {
        securityForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your password change API call here
            showNotification('Password change functionality will be implemented', 'info');
        });
    }
    
    // Address management
    const addAddressBtn = document.querySelector('.add-address-btn');
    if (addAddressBtn) {
        addAddressBtn.addEventListener('click', function() {
            showAddressForm();
        });
    }
    
    // Payment method management
    const addPaymentBtn = document.querySelector('.add-payment-btn');
    if (addPaymentBtn) {
        addPaymentBtn.addEventListener('click', function() {
            showPaymentForm();
        });
    }
    
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
    const changeAvatarBtn = document.querySelector('.change-avatar-btn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const avatarImg = document.querySelector('.user-avatar img');
                        if (avatarImg) {
                            avatarImg.src = e.target.result;
                            showNotification('Profile picture updated successfully!', 'success');
                        }
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        });
    }
    
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
    
    // Load user profile from API
    function loadUserProfile() {
        const userId = getUserId();
        if (!userId) {
            showNotification('Please login to view your profile', 'error');
            setTimeout(() => window.location.href = 'login.html', 2000);
            return;
        }

        const token = getAuthToken();
        if (!token) {
            showNotification('Authentication required', 'error');
            return;
        }

        fetch(`${API_BASE_URL}/Profile/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load profile');
            }
            return response.json();
        })
        .then(response => {
            // Update profile fields
            if (document.getElementById('firstName')) {
                document.getElementById('firstName').value = response.firstName || '';
            }
            if (document.getElementById('lastName')) {
                document.getElementById('lastName').value = response.lastName || '';
            }
            if (document.getElementById('email')) {
                document.getElementById('email').value = response.email || '';
            }
            if (document.getElementById('phone')) {
                document.getElementById('phone').value = response.phoneNumber || '';
            }
            if (document.getElementById('birthDate')) {
                // Format date if needed
                if (response.birthDate) {
                    const date = new Date(response.birthDate);
                    document.getElementById('birthDate').value = date.toISOString().split('T')[0];
                }
            }
            
            // Update user name and email in sidebar
            const userNameElements = document.querySelectorAll('.user-name');
            const userEmailElements = document.querySelectorAll('.user-email');
            userNameElements.forEach(el => {
                el.textContent = `${response.firstName || ''} ${response.lastName || ''}`.trim() || 'User';
            });
            userEmailElements.forEach(el => {
                el.textContent = response.email || '';
            });
        })
        .catch(error => {
            console.error('Error loading profile:', error);
            showNotification('Failed to load profile data', 'error');
        });
    }

    // Update user profile
    function updateUserProfile() {
        const userId = getUserId();
        if (!userId) {
            showNotification('Please login to update your profile', 'error');
            return;
        }

        const token = getAuthToken();
        if (!token) {
            showNotification('Authentication required', 'error');
            return;
        }

        const firstName = document.getElementById('firstName')?.value || '';
        const lastName = document.getElementById('lastName')?.value || '';
        const phone = document.getElementById('phone')?.value || '';
        const birthDateInput = document.getElementById('birthDate')?.value;

        if (!firstName || !lastName) {
            showNotification('First name and last name are required', 'error');
            return;
        }

        // Format birthDate properly for DateOnly type
        let birthDateFormatted = null;
        if (birthDateInput) {
            // DateOnly expects YYYY-MM-DD format
            birthDateFormatted = birthDateInput;
        }

        const updateData = {
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phone || null,
            birthDate: birthDateFormatted
        };

        fetch(`${API_BASE_URL}/Profile/${userId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateData)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw err; });
            }
            return response.json();
        })
        .then(response => {
            showNotification('Profile updated successfully!', 'success');
            // Reload profile to reflect changes
            setTimeout(() => loadUserProfile(), 1000);
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            const errorMsg = error.message || 'Failed to update profile';
            showNotification(errorMsg, 'error');
        });
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