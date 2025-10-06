// Global handlers for User Management page

// Open modal and populate content from data attributes on the clicked button
function openModal(triggerButton) {
  try {
    const modal = document.getElementById('userModal');
    if (!modal) return;

    // Tab containers
    const tabs = modal.querySelectorAll('.tab-content');
    if (tabs.length >= 3) {
      const email = triggerButton.dataset.email || '';
      const mobile = triggerButton.dataset.mobile || '';
      const birthdate = triggerButton.dataset.birthdate || '';
      const gender = triggerButton.dataset.gender || '';
      const role = triggerButton.dataset.role || '';
      const permission = triggerButton.dataset.permission || '';
      const address1 = triggerButton.dataset.address1 || '';
      const address2 = triggerButton.dataset.address2 || '';

      // Personal Info
      tabs[0].innerHTML = `
        <div class="info-grid">
          <div><strong>Email:</strong> ${email}</div>
          <div><strong>Mobile:</strong> ${mobile}</div>
          <div><strong>Birthdate:</strong> ${birthdate}</div>
          <div><strong>Gender:</strong> ${gender}</div>
          <div><strong>Role:</strong> ${role}</div>
          <div><strong>Permissions:</strong> ${permission}</div>
        </div>
      `;

      // Security (demo)
      tabs[1].innerHTML = `
        <div>
          <p><strong>2FA:</strong> Enabled</p>
          <p><strong>Last Password Change:</strong> 2025-06-12</p>
        </div>
      `;

      // Addresses
      tabs[2].innerHTML = `
        <ul>
          <li>${address1}</li>
          <li>${address2}</li>
        </ul>
      `;
    }

    modal.classList.add('show');
  } catch (e) {
    console.error('openModal error:', e);
  }
}

// Close modal
function closeModal() {
  const modal = document.getElementById('userModal');
  if (modal) modal.classList.remove('show');
}

// Initialize interactions once per page
document.addEventListener('DOMContentLoaded', () => {
  // Tab switching inside modal
  const modal = document.getElementById('userModal');
  if (modal) {
    const tabButtons = modal.querySelectorAll('.tab-btn');
    const tabContents = modal.querySelectorAll('.tab-content');
    tabButtons.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        if (tabContents[idx]) tabContents[idx].classList.add('active');
      });
    });

    // Close when clicking outside content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Table action buttons (Edit/Delete/Suspend) - demo handlers
  const table = document.querySelector('.users-table');
  if (table) {
    table.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;

      if (btn.classList.contains('btn-edit')) {
        alert('Edit user (demo)');
      } else if (btn.classList.contains('btn-delete')) {
        const row = btn.closest('tr');
        if (row && confirm('Delete this user?')) {
          row.remove();
        }
      } else if (btn.classList.contains('btn-suspend')) {
        alert('User suspended (demo)');
      }
    });
  }

  // Add User (demo)
  const addBtn = document.querySelector('.btn-add');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      alert('Add User clicked (demo)');
    });
  }
});

// Expose functions globally for inline handlers in HTML
window.openModal = openModal;
window.closeModal = closeModal;


