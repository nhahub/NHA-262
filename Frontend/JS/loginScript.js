$(document).ready(function () {
   $(".form").submit(function (e) { 
    e.preventDefault();
    let user=$("#username").val();
    let pw=$("#password").val();
    if (user=="admin" && pw=="1234") {
        window.location.href="merchhome.html";
    }
    else{
        $("#err").text("❌ Wrong username or password!");
    }
   });
});
