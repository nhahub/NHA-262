$(document).ready(function () {
      $("#err").text("");

  // شغل العنوان من البداية
  title(1);

  // تاريخ الميلاد
  $("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: "-100:+0",
  });

  // موبايل
  var input = $("#telephone");
  var iti = window.intlTelInput(input[0], {
    initialCountry: "auto",
    separateDialCode: true,
    geoIpLookup: function (success, failure) {
      $.get("https://ipapi.co/json/", function (data) {
        success(data.country_code);
      }).fail(function () {
        success("us");
      });
    },
    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/js/utils.js",
  });

  // ---------- التنقل ----------

  // step1 → validate email + pw
async function checkExist(url, data) {
  return $.ajax({
    type: "post",
    url: url,
    data: data,
    dataType: "json"
  });
}

$("#next1").click(async function (e) {
  e.preventDefault()
if (!validateEmail()) { $("#email").focus(); return; }
if (!validatePW()) { $("#pw1").focus(); return; }

  let email = $("#email").val().trim();
  let emailRes = await checkExist("http://localhost:5259/api/Users/Register/CheckEmail", { email: email });

  if (emailRes.exist) {
    $("#err").text("❌ Email already registered");
    return;
  }

  let username = $("#username").val().trim();
  let userRes = await checkExist("http://localhost:5259/api/Users/Register/CheckUsername", { user: username });

  if (userRes.exist) {
    $("#err").text("❌ Username already registered");
    return;
  }
    // كله تمام
    $("#err").text("");
    $(".step").removeClass("active");
    $("#step2").addClass("active");
    title(2);
});


  // step2 → check personal info
  $("#next2").click(function () {
    let FName = $("#FName").val().trim();
    let LName = $("#LName").val().trim();
    let telephone = $("#telephone").val().trim();
    let gender = $("input[name='Gender']:checked").val();
    let Birth = $("#datepicker").val().trim();

    if (FName === "" || LName === "" || telephone === "" || !gender || Birth === "") {
      $("#err2").text("❗ All fields are required");
      return;
    }

    $("#err2").text("");
    $(".step").removeClass("active");
    $("#step3").addClass("active");
    title(3);
  });

  // Back buttons
  $("#prev1").click(function () {
    $(".step").removeClass("active");
    $("#step1").addClass("active");
    title(1);
  });

  $("#prev2").click(function () {
    $(".step").removeClass("active");
    $("#step2").addClass("active");
    title(2);
  });

  // ---------- التحقق من الايميل والباس ----------

function validateEmail() {
  var em = $("#email").val().trim();
  var emailregex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

  if (!emailregex.test(em)) {
    $("#err").text("❌ Enter valid email");
    return false;
  }
  return true;
}


 function validatePW() {
  var pw = $("#pw1").val();
  var confpw = $("#pw2").val();
  var pwregex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;

  if (pw !== confpw) {
    $("#err").text("❌ Passwords do not match");
    return false;
  }

  if (!pwregex.test(pw)) {
    $("#err").text(
      "❌ Password must be 8+ chars with uppercase, lowercase, number, special char"
    );
    return false;
  }

  return true;
}

  // ---------- تغيير العنوان ----------
  function title(step) {
    if (step == 1) {
      $("#tagg").text("Signup");
    } else if (step == 2) {
      $("#tagg").text("Personal Info");
    } else if (step == 3) {
      $("#tagg").text("Optional: Address");
    }
  }

  // ---------- سبميت ----------
  $(".FORM").submit(function (e) {
  e.preventDefault();
  $.ajax({
    type: "post",
    url: "http://localhost:5259/api/Users/Register",
    data: $(this).serialize(), // بدل "data"
    success: function (response) {
      window.location.href = "login.html"; // خلي النقل جوا success
    }
  });
});

});
