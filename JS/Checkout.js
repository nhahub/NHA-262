// Checkout.js
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

// Get cart items from localStorage
function getCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart;
}

const paymentSelect = document.querySelector('select[name="payment"]');
const cardInfo = document.getElementById('card-info');
const paypalDiv = document.getElementById('paypal');
const card = document.getElementById("myform");
  
  
  
if (paymentSelect) {
    paymentSelect.addEventListener('change', ()=>{
        if(paymentSelect.value==='card'){
            if (cardInfo) cardInfo.style.display='block';
        } else {
            if (cardInfo) cardInfo.style.display='none';
        }

        if(paymentSelect.value==='paypal'){
            if (paypalDiv) paypalDiv.style.display='block';
        } else {
            if (paypalDiv) paypalDiv.style.display='none';
        }
    });
}



 fetch("https://countriesnow.space/api/v0.1/countries")
    .then(res => res.json())
    .then(data => {
      const countrySelect = document.getElementById("country");
      const citySelect = document.getElementById("city");

     
      data.data.forEach(countryObj => {
        const opt = document.createElement("option");
        opt.value = countryObj.country;
        opt.textContent = countryObj.country;
        countrySelect.appendChild(opt);
      });

      
      countrySelect.addEventListener("change", function(){
        const selected = data.data.find(c => c.country === this.value);
        citySelect.innerHTML = '<option hidden selected> Select City </option>';
        if (selected && selected.cities) {
          selected.cities.forEach(city => {
            const opt = document.createElement("option");
            opt.value = city;
            opt.textContent = city;
            citySelect.appendChild(opt);
          });
        }
      });
    });
const form = document.getElementById("myform");
const successNotification = document.getElementById("successNotification");

if (form) {
    form.addEventListener("submit", function(e) {
        e.preventDefault(); 
        console.log("Form submitted!"); 
        processCheckout();
    });
}

function showNotification(message, type = "success") {
    if (!successNotification) return;
    
    successNotification.textContent = message || "Data submitted successfully!... ✅";
    successNotification.className = `notification ${type}`;
    successNotification.style.display = "block";
    successNotification.style.animation = "slideDown 0.3s ease-out";
    
    setTimeout(() => {
        successNotification.style.animation = "slideUp 0.3s ease-out";
        setTimeout(() => {
            successNotification.style.display = "none";
        }, 300);
    }, 3000);
}

// Process checkout
function processCheckout() {
    const userId = getUserId();
    if (!userId) {
        showNotification('Please login to checkout', 'error');
        setTimeout(() => window.location.href = 'login.html', 2000);
        return;
    }

    const token = getAuthToken();
    if (!token) {
        showNotification('Authentication required', 'error');
        return;
    }

    // Get cart items
    const cartItems = getCartItems();
    if (!cartItems || cartItems.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    // Get form data
    const formData = new FormData(form);
    const fullName = formData.get('fullname') || '';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || formData.get('mobile') || '';
    const address = formData.get('address') || '';
    const city = document.getElementById('city')?.value || '';
    const country = document.getElementById('country')?.value || '';
    const postalCode = formData.get('ZIP') || '';
    const paymentMethod = formData.get('payment') || 'cod';

    // Validate required fields
    if (!fullName || !email || !phone || !address || !city || !country) {
        showNotification('Please fill all required fields', 'error');
        return;
    }

    // Prepare cart items for API
    const cartItemsDto = cartItems.map(item => ({
        productId: item.id || item.productId || item.product_id,
        quantity: item.quantity || 1,
        price: item.price || 0
    }));

    // Prepare checkout data according to CheckoutDto structure
    const checkoutData = {
        userId: parseInt(userId),
        cartItems: cartItemsDto,
        shippingInfo: {
            fullName: fullName,
            email: email,
            phone: phone,
            address: address,
            city: city,
            country: country,
            postalCode: postalCode
        },
        paymentInfo: {
            paymentMethod: paymentMethod, // "card", "paypal", "cod"
            cardNumber: formData.get('cardnumber') || '',
            cardHolder: formData.get('cardname') || '',
            expiryDate: formData.get('expiry') || '',
            cvv: formData.get('cvc') || '' // ASP.NET Core JSON serialization converts to camelCase
        }
    };

    // Send to backend
    fetch(`${API_BASE_URL}/Checkout`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutData)
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(response => {
        console.log('Checkout success:', response);
        showNotification(`Order placed successfully! Order ID: ${response.orderId}`, 'success');
        
        // Clear cart after successful checkout
        localStorage.removeItem('cart');
        
        // Redirect to order tracking or success page after 3 seconds
        setTimeout(() => {
            window.location.href = 'ordertracking.html';
        }, 3000);
    })
    .catch(error => {
        console.error('Checkout error:', error);
        const errorMsg = error.message || 'Checkout failed. Please try again.';
        showNotification(errorMsg, 'error');
    });
}
 
    fetch("https://restcountries.com/v3.1/all")
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("countryCode");

      data.forEach(country => {
        const opt = document.createElement("option");
        const code = country.idd?.root
          ? country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : "")
          : "";
        opt.value = code;
        opt.textContent = `${country.flag} ${country.name.common} (${code})`;
        select.appendChild(opt);
      });
    });
