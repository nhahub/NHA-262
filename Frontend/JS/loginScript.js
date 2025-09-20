$(document).ready(function () {
  $(".form").submit(function (e) {
      var formdata = $(this).serialize();
      $.ajax({
          type: "post",
          url: "http://localhost:5259/api/Users/login",
          data: formdata,
          success: function (response) {
          e.preventDefault();
        window.location.href = "merchhome.html";
      },
      error: function name(response) {
        $("#err").text("❌ Wrong username or password!");
      },
    });
  });
});
