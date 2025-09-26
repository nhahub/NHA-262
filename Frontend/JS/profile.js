// profile.js
// صفحة Profile & Settings - JS جاهز للربط مع API أو تشغيل Mock محلي.
// --- اقرأ التعليقات داخل الملف لتعرف كيف توصل السيرفر لاحقاً.

(() => {
  // لو هتوصل Backend حط هنا رابط الـ API الأساسي، مثلاً: const API_BASE = "https://api.example.com";
  const API_BASE = ""; // لو فاضي => هنشتغل بالـ mock المحلي (localStorage)
  const useMock = !API_BASE;

  // LocalStorage key للـ mock
  const LS_KEY = "mock_user_profile_v1";

  // عناصر الـ DOM
  const userNameEl = document.getElementById("userName");
  const userEmailEl = document.getElementById("userEmail");
  const addressesListEl = document.getElementById("addressesList");
  const paymentsListEl = document.getElementById("paymentsList");
  const alertContainer = document.getElementById("alertContainer");

  // Forms
  const editProfileForm = document.getElementById("editProfileForm");
  const addressForm = document.getElementById("addressForm");
  const paymentForm = document.getElementById("paymentForm");
  const changePasswordForm = document.getElementById("changePasswordForm");

  // Bootstrap modals (so we can hide them from JS)
  const modalEditProfile = new bootstrap.Modal(document.getElementById("modalEditProfile"));
  const modalAddAddress = new bootstrap.Modal(document.getElementById("modalAddAddress"));
  const modalAddPayment = new bootstrap.Modal(document.getElementById("modalAddPayment"));
  const modalChangePassword = new bootstrap.Modal(document.getElementById("modalChangePassword"));

  /* ---------- Mock data init (only if useMock) ---------- */
  const initialMock = {
    name: "Ahmed Ali",
    email: "ahmed@example.com",
    password: "Password123!", // فقط للـ mock (لا تستخدم هذا الأسلوب في الواقع)
    addresses: [
      { id: 1, text: "123 شارع النيل، القاهرة، مصر" }
    ],
    payments: [
      { id: 1, cardName: "Ahmed Ali", cardNumber: "4242424242424242", expiry: "12/26" }
    ]
  };

  function ensureMock() {
    if (!localStorage.getItem(LS_KEY)) {
      localStorage.setItem(LS_KEY, JSON.stringify(initialMock));
    }
  }

  function getMock() {
    return JSON.parse(localStorage.getItem(LS_KEY));
  }
  function setMock(data) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }

  /* ---------- Helpers ---------- */
  function showAlert(message, type = "success", timeout = 3000) {
    const id = "a" + Date.now();
    const el = document.createElement("div");
    el.id = id;
    el.className = `alert alert-${type} alert-dismissible fade show`;
    el.role = "alert";
    el.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    alertContainer.appendChild(el);
    if (timeout) setTimeout(() => { const e = document.getElementById(id); if (e) e.remove(); }, timeout);
  }

  function maskCard(num) {
    const s = String(num).replace(/\s+/g, "");
    if (s.length <= 4) return s;
    return "**** **** **** " + s.slice(-4);
  }

  /* ---------- Rendering ---------- */
  function renderProfileUI(data) {
    userNameEl.innerText = data.name || "—";
    userEmailEl.innerText = data.email || "—";
    renderAddresses(data.addresses || []);
    renderPayments(data.payments || []);
  }

  function renderAddresses(list) {
    addressesListEl.innerHTML = "";
    if (!list.length) {
      addressesListEl.innerHTML = `<li class="list-group-item small-muted">لا توجد عناوين محفوظة.</li>`;
      return;
    }
    list.forEach((a, idx) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-start";
      li.innerHTML = `<div>${a.text}</div>
        <div>
          <button class="btn btn-sm btn-outline-danger btn-delete-address" data-id="${a.id}">حذف</button>
        </div>`;
      addressesListEl.appendChild(li);
    });
  }

  function renderPayments(list) {
    paymentsListEl.innerHTML = "";
    if (!list.length) {
      paymentsListEl.innerHTML = `<li class="list-group-item small-muted">لا توجد طرق دفع محفوظة.</li>`;
      return;
    }
    list.forEach((p) => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-start";
      li.innerHTML = `<div>
          <div><strong>${p.cardName}</strong></div>
          <div class="small-muted">${maskCard(p.cardNumber)} · ${p.expiry}</div>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-danger btn-delete-payment" data-id="${p.id}">حذف</button>
        </div>`;
      paymentsListEl.appendChild(li);
    });
  }

  /* ---------- API wrapper (works with real API or mock) ---------- */
  async function apiGetProfile() {
    if (useMock) {
      ensureMock();
      return getMock();
    } else {
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "GET",
        headers: { "Content-Type": "application/json", /* add Authorization if needed */ }
      });
      if (!res.ok) throw new Error("Fetch profile failed");
      return res.json();
    }
  }

  async function apiUpdateProfile(payload) {
    if (useMock) {
      const data = getMock();
      data.name = payload.name;
      data.email = payload.email;
      setMock(data);
      return data;
    } else {
      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Update profile failed");
      return res.json();
    }
  }

  async function apiAddAddress(text) {
    if (useMock) {
      const data = getMock();
      const id = Date.now();
      data.addresses.push({ id, text });
      setMock(data);
      return { id, text };
    } else {
      const res = await fetch(`${API_BASE}/api/user/addresses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error("Add address failed");
      return res.json();
    }
  }

  async function apiDeleteAddress(id) {
    if (useMock) {
      const data = getMock();
      data.addresses = data.addresses.filter(a => a.id != id);
      setMock(data);
      return true;
    } else {
      const res = await fetch(`${API_BASE}/api/user/addresses/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete address failed");
      return true;
    }
  }

  async function apiAddPayment(payment) {
    if (useMock) {
      const data = getMock();
      const id = Date.now();
      data.payments.push(Object.assign({ id }, payment));
      setMock(data);
      return { id, ...payment };
    } else {
      const res = await fetch(`${API_BASE}/api/user/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payment)
      });
      if (!res.ok) throw new Error("Add payment failed");
      return res.json();
    }
  }

  async function apiDeletePayment(id) {
    if (useMock) {
      const data = getMock();
      data.payments = data.payments.filter(p => p.id != id);
      setMock(data);
      return true;
    } else {
      const res = await fetch(`${API_BASE}/api/user/payments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete payment failed");
      return true;
    }
  }

  async function apiChangePassword(oldPass, newPass) {
    if (useMock) {
      const data = getMock();
      if (oldPass !== data.password) throw new Error("كلمة المرور الحالية غير صحيحة");
      data.password = newPass;
      setMock(data);
      return true;
    } else {
      const res = await fetch(`${API_BASE}/api/user/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass })
      });
      if (!res.ok) {
        const err = await res.text().catch(() => "Change password failed");
        throw new Error(err);
      }
      return true;
    }
  }

  /* ---------- Events ---------- */
  // Load initial data
  async function loadAll() {
    try {
      const profile = await apiGetProfile();
      renderProfileUI(profile);
    } catch (err) {
      console.error(err);
      showAlert("حصل خطأ أثناء جلب البيانات", "danger");
    }
  }

  // Edit profile submit
  editProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("editName").value.trim();
    const email = document.getElementById("editEmail").value.trim();
    if (!name || !email) { showAlert("من فضلك املأ الحقول المطلوبة", "warning"); return; }
    try {
      await apiUpdateProfile({ name, email });
      modalEditProfile.hide();
      showAlert("تم تحديث البيانات بنجاح");
      await loadAll();
    } catch (err) {
      console.error(err);
      showAlert("فشل تحديث البيانات", "danger");
    }
  });

  // Address submit
  addressForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = document.getElementById("addressLine").value.trim();
    if (!text) { showAlert("أدخل العنوان", "warning"); return; }
    try {
      await apiAddAddress(text);
      modalAddAddress.hide();
      document.getElementById("addressLine").value = "";
      showAlert("تم إضافة العنوان");
      await loadAll();
    } catch (err) {
      console.error(err);
      showAlert("فشل إضافة العنوان", "danger");
    }
  });

  // Payment submit
  paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const cardName = document.getElementById("cardName").value.trim();
    const cardNumber = document.getElementById("cardNumber").value.replace(/\s+/g, "");
    const expiry = document.getElementById("cardExpiry").value.trim();
    const cvv = document.getElementById("cardCvv").value.trim();
    if (!cardName || !cardNumber || !expiry || !cvv) { showAlert("اكمل بيانات البطاقة", "warning"); return; }
    try {
      await apiAddPayment({ cardName, cardNumber, expiry });
      modalAddPayment.hide();
      paymentForm.reset();
      showAlert("تم إضافة طريقة الدفع");
      await loadAll();
    } catch (err) {
      console.error(err);
      showAlert("فشل إضافة طريقة الدفع", "danger");
    }
  });

  // Change password submit
  changePasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const oldP = document.getElementById("oldPassword").value;
    const newP = document.getElementById("newPassword").value;
    const conf = document.getElementById("confirmNewPassword").value;
    if (!oldP || !newP || !conf) { showAlert("اكمل الحقول", "warning"); return; }
    if (newP !== conf) { showAlert("تأكيد كلمة المرور لا يطابق", "warning"); return; }
    try {
      await apiChangePassword(oldP, newP);
      modalChangePassword.hide();
      changePasswordForm.reset();
      showAlert("تم تحديث كلمة المرور");
    } catch (err) {
      console.error(err);
      showAlert(err.message || "فشل تغيير كلمة المرور", "danger");
    }
  });

  // Delegation for delete address/payment buttons
  addressesListEl.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete-address")) {
      const id = e.target.getAttribute("data-id");
      if (!confirm("متأكد أنك عايز تحذف العنوان؟")) return;
      try {
        await apiDeleteAddress(id);
        showAlert("تم حذف العنوان");
        await loadAll();
      } catch (err) {
        console.error(err);
        showAlert("فشل حذف العنوان", "danger");
      }
    }
  });

  paymentsListEl.addEventListener("click", async (e) => {
    if (e.target.classList.contains("btn-delete-payment")) {
      const id = e.target.getAttribute("data-id");
      if (!confirm("متأكد أنك عايز تحذف طريقة الدفع؟")) return;
      try {
        await apiDeletePayment(id);
        showAlert("تم حذف طريقة الدفع");
        await loadAll();
      } catch (err) {
        console.error(err);
        showAlert("فشل حذف طريقة الدفع", "danger");
      }
    }
  });

  // When "Edit" modal opens populate current values
  document.getElementById("btnEditProfile").addEventListener("click", () => {
    const data = useMock ? getMock() : null;
    if (data) {
      document.getElementById("editName").value = data.name;
      document.getElementById("editEmail").value = data.email;
    } else {
      // لو عندك API فعلي وعايز تجيب القيم قبل الفتح، نقدر نعمل fetch هنا
    }
  });

  /* ---------- Init ---------- */
  loadAll();

})();

