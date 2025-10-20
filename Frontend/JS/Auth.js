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
url: "https://localhost:7212/api/Users/RefreshToken",
        method: 'POST',
        xhrFields: { withCredentials: true }, // مهم لإرسال الكوكي تلقائي
        success: function(data) {
            if (data.jwt && data.jwtExpiry) {
                // حدث JWT و jwtExpiry فقط في التخزين
                localStorage.setItem('Auth', JSON.stringify({
                    jwt: data.jwt,
                    jwtExpiry: data.jwtExpiry
                }));
            }
        },
        error: function() {
            console.log('Refresh token failed');
        }
    });
}

// فحص JWT عند تحميل الصفحة
$(document).ready(function() {
    var tokenData = getAuthTokens();

    if (!tokenData) {
        // لو مش موجود JWT، ارجع للـ login
        window.location.href = '/login.html';
        return;
    }

    if (isTokenExpired(tokenData)) {
        // لو التوكن انتهت صلاحيته حاول تعمل refresh
        refreshToken().done(function() {
            var newTokenData = getAuthTokens();
            if (!newTokenData || isTokenExpired(newTokenData)) {
                // لو فشل الريفرش أو التوكن الجديدة انتهت
                window.location.href = '/login.html';
            }
        });
    }
});
