$(document).ready(function () {
  $("#err").text("");
  $("#step1").submit(function (e) {
    e.preventDefault();
    $("#err").text("");
    var formdata = $(this).serialize();
    $.ajax({
      type: "post",
      url: "https://cartify.runasp.net/api/Users/Login",
      data: formdata,
      success: function (response) {
        const rememberMe = $("#rememberMe").is(":checked");
        const data = {
          jwt: response.jwt,
          jwtExpiry: response.jwtExpiry,
          rememberMe: rememberMe   // ← حفظ حالة Remember Me
        };

        // تخزين الـ token
        if (rememberMe) {
          localStorage.setItem("Auth", JSON.stringify(data));
        } else {
          sessionStorage.setItem("Auth", JSON.stringify(data));
        }

        // دالة لفك JWT
        function parseJwt(token) {
          try {
            const base64Payload = token.split(".")[1];
            const payload = atob(base64Payload);
            return JSON.parse(payload);
          } catch (e) {
            return null;
          }
        }

        const tokenData = parseJwt(response.jwt);

        // الوصول للroles
        const roles = tokenData
          ? tokenData[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ]
          : [];

        // تحويل string لو فيه role واحد
        const rolesArray = Array.isArray(roles) ? roles : [roles];

        // Redirect حسب الدور
        if (rolesArray.includes("Merchant")) {
          window.location.href = "merchhome.html";
        } else {
          window.location.href = "index.html";
        }
      },
      error: function (response) {
        $("#err").text("❌ Wrong username or password!");

        $("#password").val("");
      },
    });
  });

  $("#frgt").click(function (e) {
    e.preventDefault();
    $("#err").text("");

    $("#step1").removeClass("active");

    $("#step2").addClass("active");
  });

  $("#step2").submit(function (e) {
    e.preventDefault();
    $("#err").text("");

    let email = $("#email").val().trim();
    let emailregex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

    if (email === "") {
      $("#err").text("All fields are required!");
      return;
    }
    if (!emailregex.test(email)) {
      $("#err").text("Enter Valid email");
      return;
    }

    $.ajax({
      type: "post",
      url: "https://cartify.runasp.net/api/Users/ResetPassword/CheckEmailAndGenerateCode",
      data: JSON.stringify(email),
      contentType: "application/json",
      success: function (response) {
        $("#step2").removeClass("active");
        $("#step3").addClass("active");
        $("#err").text("✅ A message has been sent to your email!");
      },
      error: function (response) {
        $("#err").text("❌ Enter valid email or server error");
        console.log(response.responseText);
      },
    });
  });

  $("#step3").submit(function (e) {
    e.preventDefault();
    $("#err").text("");

    let code = $("#Code").val().trim();
    if (code === "") {
      $("#err").text("Enter valid code");
      return;
    }

    // تحقق من الباسورد
    if (!validatePW()) return;

    // تحضير البيانات لإرسالها للـ API
    let dataform = JSON.stringify({
      Code: code,
      Password: $("#password1").val(),
    });

    $.ajax({
      type: "post",
      url: "https://localhost:7212/api/Users/ResetPassword/CheckCodeAndChangePassword",
      data: dataform,
      contentType: "application/json",
      success: function (response) {
        $("#err").text("✅ Password changed successfully!");
        $("#step3").removeClass("active");
        $("#step1").addClass("active");
        // إعادة ضبط الفورمز
        $("#step3")[0].reset();
        $("#step1")[0].reset();
      },
      error: function (response) {
        $("#err").text("❌ Invalid code or password error");
        console.log(response.responseText);
      },
    });
  });

  function validatePW() {
    let pw = $("#password1").val();
    let confpw = $("#password2").val();
    let check = true;
    var pwregex =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
    if (pw == confpw) {
      if (pwregex.test(pw)) {
        $("p").text("");
      } else {
        $("p").text(
          "❌ Password must be 8+ chars with uppercase, lowercase, and number"
        );
        check = false;
      }
    } else {
      $("p").text("password isn't matched");
      check = false;
    }
    return check;
  }
});
