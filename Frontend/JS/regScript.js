$(document).ready(function () {
  let currentStep = 0;
  let steps = $(".step");

  $(function () {
    $("#datepicker").datepicker({
      changeMonth: true,
      changeYear: true,
      yearRange: "-100:+0",
    });
  });

  var input = $("#telephone");

  var iti = window.intlTelInput(input[0], {
 initialCountry: "auto", 
  separateDialCode: true,
  countrySearch: false,

  geoIpLookup: function (success, failure) {
    $.get("https://ipapi.co/json/", function (data) {
      success(data.country_code); 
    }).fail(function () {
      success("us");
    });
  },Search: false,

    utilsScript:
      "https://cdn.jsdelivr.net/npm/intl-tel-input@25.10.1/build/js/utils.js",
  });

  $(".next").click(function () {
        if (currentStep == 0) {
            validateEmail();
        }
        else{
            
            $(steps[currentStep]).removeClass("active");
            currentStep++;
            $(steps[currentStep]).addClass("active");
        }
  });
  function validateEmail() { 
     var em = $("#email").val();
      var emailregex = /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
       if (emailregex.test(em)) {
        validatePW();
       }
       else {
        $("p").text("❌ Enter valid email");
      }
   }
  function validatePW() {
          var pw = $("#pw1").val();
      var confpw = $("#pw2").val();

      var pwregex =
        /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;
    if (pw == confpw) {
          if (pwregex.test(pw)) {
            $("p").text("");

            $(steps[currentStep]).removeClass("active");
            currentStep++;
            $(steps[currentStep]).addClass("active");
          } else {
            $("p").text(
              "❌ Password must be 8+ chars with uppercase, lowercase, and number"
            );
          }
        } else {
          $("p").text("password isn't matched");
        }
    }

  $(".prev").click(function () {
    $(steps[currentStep]).removeClass("active");
    currentStep--;
    $(steps[currentStep]).addClass("active");
  });
$(".FORM").submit(function (e) { 
  e.preventDefault();
  window.location.href = "login.html";    
});
});
