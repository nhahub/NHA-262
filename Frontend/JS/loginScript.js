$(document).ready(function () {
  // Clear error message on page load
  $("#err").text("");

  // =========================
  // Step 1: Login Form
  // =========================
  $("#step1").submit(function (e) {
    e.preventDefault();
    $("#err").text("");

    var formdata = $(this).serialize(); // Collect form data

    $.ajax({
      type: "post",
      url: "http://localhost:5259/api/Users/login", // Login API
      data: formdata,
      success: function (response) {
        // Redirect to home page on success
        window.location.href = "merchhome.html";
      },
      error: function (response) {
        // Show error message on failure
        $("#err").text("❌ Wrong username or password!");
        $("#password").val(""); // Clear password field
      },
    });
  });

  // =========================
  // Forgot Password → Switch from Step1 to Step2
  // =========================
  $("#frgt").click(function (e) {
    e.preventDefault();
    $("#err").text("");

    $("#step1").removeClass("active"); // Hide Step1
    $("#step2").addClass("active"); // Show Step2
  });

  // =========================
  // Step 2: Check Email
  // =========================
  $("#step2").submit(function (e) {
    e.preventDefault();
    $("#err").text("");

    let email = $("#email").val().trim(); // Get email value
    let emailregex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

    // Check if email is empty
    if (email === "") {
      $("#err").text("All fields are required!");
      return;
    }

    // Validate email format
    if (!emailregex.test(email)) {
      $("#err").text("Enter Valid email");
      return;
    }

    // Send email to backend
    dataform = $("#step2").serialize();
    $.ajax({
      type: "post",
      url: "http://localhost:5259/api/Users/check", // Check email API
      data: dataform,
      success: function (response) {
        // Move from Step2 → Step3
        $("#step2").removeClass("active");
        $("#step3").addClass("active");
        $("#err").text("A message has been sent to your email!");
      },
      error: function (response) {
        $("#err").text("Enter Valid email");
      },
    });
  });

  // =========================
  // Step 3: Reset Password
  // =========================
  $("#step3").submit(function (e) {
    e.preventDefault();
    $("#err").text("");

    // Check if code is entered
    if ($("#Code").val() === "") {
      $("#err").text("Enter valid code");
      return;
    }

    // Validate new password
    if (validatePW()) {
      $("#err").text("");
      $("#step3").removeClass("active"); // Hide Step3
      $("#step1").addClass("active"); // Back to Step1 (login)
      $(".form").each(function () {
        $(".form").find('input[type="text"], input[type="password"]').val("");

      });
    }
  });

  // =========================
  // Validate Password Strength
  // =========================
  function validatePW() {
    let pw = $("#password1").val();
    let confpw = $("#password2").val();
    let check = true;

    // Regex: must contain number + uppercase + lowercase + special char
    var pwregex =
      /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;

    if (pw == confpw) {
      if (pwregex.test(pw)) {
        $("p").text(""); // Password is valid
      } else {
        $("p").text(
          "❌ Password must be 8+ chars with uppercase, lowercase, and number"
        );
        check = false;
      }
    } else {
      $("p").text("Password doesn't match");
      check = false;
    }

    return check;
  }
});
