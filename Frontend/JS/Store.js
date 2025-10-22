$(document).ready(function () {
    // جلب القيمة القديمة من Auth
    const oldAuth = localStorage.getItem("Auth") || sessionStorage.getItem("Auth");
    const oldRememberMe = oldAuth ? JSON.parse(oldAuth).rememberMe : false;

    // التعامل مع submit للفورم وليس الزر
    $("#step1").submit(function (e) {
        e.preventDefault();

        // جلب قيمة StoreName بعد الضغط
        let storeName = $("#StoreName").val().trim();

        if (!storeName) {
            alert("Please enter Store Name");
            return;
        }

        $.ajax({
            type: "post",
            url: "https://localhost:7212/api/Users/CreateMerchantProfile",
            data: JSON.stringify(storeName),
            headers: { "Authorization": "Bearer " + (oldAuth ? JSON.parse(oldAuth).jwt : "") },
            contentType: "application/json",
            success: function (response) {
                // تخزين التوكين الجديد مع Remember Me
                const data = {
                    jwt: response.jwt,
                    jwtExpiry: response.jwtExpiry,
                    rememberMe: oldRememberMe
                };

                if (oldRememberMe) {
                    localStorage.setItem("Auth", JSON.stringify(data));
                } else {
                    sessionStorage.setItem("Auth", JSON.stringify(data));
                }

                console.log("Token updated:", data);

                // الانتقال للصفحة الجديدة
                window.location.href = "/index.html";
            },
            error: function (err) {
                console.log("Error:", err);
                alert("Error creating merchant profile. Check console for details.");
            }
        });
    });
});
