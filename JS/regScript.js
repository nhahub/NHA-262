$(document).ready(function () {
    $("#err").text("");

    // ---------- Set initial title ----------
    title(1);

    // ---------- Datepicker ----------
$("#datepicker").datepicker({
    changeMonth: true,
    changeYear: true,
    yearRange: "-100:+0",
    maxDate: "-18Y" // يمنع اختيار تاريخ ميلاد أقل من 18 سنة
});


    // ---------- Telephone ----------
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

    // ---------- Validate all fields in a step ----------
    function allFieldsFilled(step) {
        let empty = false;
        if (step === 1) {
            let email = $("#email").val().trim();
            let username = $("#username").val().trim();
            let pw1 = $("#pw1").val();
            let pw2 = $("#pw2").val();
            if (!email || !username || !pw1 || !pw2) empty = true;
        } else if (step === 2) {
            let FName = $("#FName").val().trim();
            let LName = $("#LName").val().trim();
            let telephone = $("#telephone").val().trim();
            let gender = $("input[name='Gender']:checked").val();
            let Birth = $("#datepicker").val().trim();
            if (!FName || !LName || !telephone || !gender || !Birth) empty = true;
        }

        if (empty) {
            if (step === 1) $("#err").text("❗ All fields are required");
            else if (step === 2) $("#err2").text("❗ All fields are required");
            return false;
        }
        return true;
    }

    // ---------- Step 1 ----------
    $("#next1").click(function (e) {
        e.preventDefault();

        if (!allFieldsFilled(1)) return;
        if (!validateEmail()) { $("#email").focus(); return; }
        if (!validatePW()) { $("#pw1").focus(); return; }

        // كله تمام → روح Step 2
        $("#err").text("");
        $(".step").removeClass("active");
        $("#step2").addClass("active");
        title(2);
    });

    // ---------- Step 2 ----------
    $("#next2").click(function () {
        if (!allFieldsFilled(2)) return;

        $("#err2").text("");
        $(".step").removeClass("active");
        $("#step3").addClass("active");
        title(3);
    });

    // ---------- Back buttons ----------
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

    // ---------- Email & Password ----------
    function validateEmail() {
        var em = $("#email").val().trim();
        var emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailregex.test(em)) { $("#err").text("❌ Enter valid email"); return false; }
        return true;
    }

    function validatePW() {
        var pw = $("#pw1").val();
        var confpw = $("#pw2").val();
        var pwregex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/;

        if (pw !== confpw) { $("#err").text("❌ Passwords do not match"); return false; }
        if (!pwregex.test(pw)) { $("#err").text("❌ Password must be 8+ chars with uppercase, lowercase, number, special char"); return false; }
        return true;
    }

    // ---------- Change title ----------
    function title(step) {
        switch (step) {
            case 1: $("#tagg").text("Signup"); break;
            case 2: $("#tagg").text("Personal Info"); break;
            case 3: $("#tagg").text("Optional: Address"); break;
        }
    }

// ---------- Submit Form ----------
$(".FORM").submit(function (e) {
    e.preventDefault();

    $.ajax({
        type: "post",
        url: "https://cartify.runasp.net/api/Users/Register",
        data: $(this).serialize(),
        success: function () { 
            // لو التسجيل نجح
            window.location.href = "login.html"; 
        },
error: function(xhr) {
    let msg = xhr.responseText;

    if (msg.includes("Email")) {
        $(".step").removeClass("active");
        $("#step1").addClass("active");
        $("#err").text(msg);
        $("#email").focus();
    } else if (msg.includes("Username")) {
        $(".step").removeClass("active");
        $("#step1").addClass("active");
        $("#err").text(msg);
        $("#username").focus();
    } else {
        alert(msg || "❌ Registration failed. Try again.");
    }
}

    });
});

});
