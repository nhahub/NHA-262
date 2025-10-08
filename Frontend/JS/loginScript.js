$(document).ready(function () {

  $("#err").text("");
  $("#step1").submit(function (e) {
    e.preventDefault();
    $("#err").text("");
    var formdata = $(this).serialize();
    $.ajax({
      type: "post",
      url: "https://localhost:7212/api/Users/Login",
      data: formdata,
      success: function (response) {
        window.location.href = "merchhome.html";
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
    dataform=$("#step2").serialize();
    $.ajax({
      type: "post",
      url: "http://localhost:5259/api/Users/check",
      data:dataform,
      success: function (response) {
        
        $("#step2").removeClass("active");
    
        $("#step3").addClass("active");
        $("#err").text("A message has been sent to your email!");
      },
      error: function (response) { 
      $("#err").text("Enter Valid email");

       }
    });
  });

  $("#step3").submit(function (e) {
    e.preventDefault();
    $("#err").text("");
    if ($("#Code").val() === "") {
      $("#err").text("Enter valid code");
      return;
    }
    if (validatePW()) {
      $("#err").text("");
      $("#step3").removeClass("active");
      $("#step1").addClass("active");
    }
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
