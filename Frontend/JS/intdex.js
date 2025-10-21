$(document).ready(function () {
  let authData =
    JSON.parse(localStorage.getItem("Auth")) ||
    JSON.parse(sessionStorage.getItem("Auth"));

  if (authData && authData.jwt) {
    $("#login").hide();
    $("#register").hide();
    $("#drop").css("display", "flex");

    // ======== parse JWT ========
    const tokenData = parseJwt(authData.jwt);
    const roles = tokenData
      ? tokenData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      : [];
    const rolesArray = Array.isArray(roles) ? roles : [roles];

    // ===================== Own Your Own Store =====================
    if (!rolesArray.includes("Merchant")) { // طالما مش Merchant
      if ($("#ownStore").length === 0) {
        const ownStoreLink = `
          <a class="dropdown-item d-flex align-items-center" id="ownStore" href="merchant-signup.html">
            <div class="icon d-flex align-items-center justify-content-center me-3">
              <span class="ion-ios-briefcase"></span>
            </div>
             Own A Store
          </a>
        `;
        $("#drop .dropdown-menu").prepend(ownStoreLink);
      }
    } else {
      $("#ownStore").remove(); // لو الدور Merchant، نحذف الزر
    }

    // ===================== Switch Role =====================
    if (rolesArray.includes("Merchant")) {
      if ($("#switchRole").length === 0) {
        const switchRoleLink = `
          <a class="dropdown-item d-flex align-items-center" id="switchRole" href="#">
            <div class="icon d-flex align-items-center justify-content-center me-3">
              <span class="ion-ios-sync"></span>
            </div>
            Switch Role
          </a>
        `;
        $("#drop .dropdown-menu").prepend(switchRoleLink);

        $("#switchRole").click(function (e) {
          e.preventDefault();
          alert("Switch Role clicked! هنا تعمل تحديث للـ JWT");
        });
      }
    } else {
      $("#switchRole").remove(); // لو مش Merchant، نحذف الزر
    }

    // ===================== Logout =====================
    $("#logout").click(function (e) { 
      e.preventDefault();
      localStorage.removeItem("Auth");
      sessionStorage.removeItem("Auth");
      location.reload();
    });

  } else {
    $("#login").show();
    $("#register").show();
    $("#drop").css("display", "none");
  }
});

// ===================== دالة parseJwt =====================
function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}
