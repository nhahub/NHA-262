// auth.js

// دالة لجلب JWT و expiry من localStorage أو sessionStorage
function getAuthTokens() {
    var authData = JSON.parse(localStorage.getItem('Auth') || sessionStorage.getItem('Auth'));
    if (!authData) return null;
    return {
        jwt: authData.jwt,
        jwtExpiry: authData.jwtExpiry
    };
}

// دالة لفحص انتهاء صلاحية JWT باستخدام jwtExpiry
function isTokenExpired(tokenData) {
    if (!tokenData || !tokenData.jwtExpiry) return true;
    var expiry = new Date(tokenData.jwtExpiry).getTime();
    var now = Date.now();
    return now >= expiry;
}

// دالة لتحديث JWT باستخدام Refresh Token الموجود في HttpOnly Cookie
function refreshToken() {
    return $.ajax({
        url: "https://cartify.runasp.net/api/Users/RefreshToken",
        method: 'POST',
        xhrFields: { withCredentials: true }, // مهم لإرسال الكوكي تلقائي
        success: function(data) {
            if (data.jwt && data.jwtExpiry) {
                // تحديث JWT و jwtExpiry فقط في التخزين
                localStorage.setItem('Auth', JSON.stringify({
                    jwt: data.jwt,
                    jwtExpiry: data.jwtExpiry
                }));
            }
        },
        error: function() {
            console.log('❌ Refresh token failed');
        }
    });
}

// فحص JWT عند تحميل الصفحة
$(document).ready(function() {
    var tokenData = getAuthTokens();

    // 🧩 تحديد إذا كانت الصفحة محمية
    // بدل ما تعتمد على data-protected، نحددها بناءً على اسم الصفحة أو المسار
    var protectedPages = [
        '/merchhome.html',
        '/cartpage.html',
        '/ordertracking.html',
        '/checkout.html',
        '/wishlist.html'
    ];

    var currentPath = window.location.pathname.toLowerCase();
    var isProtectedPage = protectedPages.some(page => currentPath.endsWith(page));

    if (!tokenData) {
        if (isProtectedPage) {
            console.warn('🔒 Protected page - redirecting to login...');
            window.location.href = '/login.html';
        } else {
            console.log('👤 Browsing as guest...');
        }
        return;
    }

    if (isTokenExpired(tokenData)) {
        refreshToken().done(function() {
            var newTokenData = getAuthTokens();
            if ((!newTokenData || isTokenExpired(newTokenData)) && isProtectedPage) {
                console.warn('🔑 Token refresh failed or expired - redirecting to login...');
                window.location.href = '/login.html';
            }
        });
    }
});
