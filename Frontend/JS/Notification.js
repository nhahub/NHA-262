// Dummy notifications
let notifications = [
  { id: 1, text: "Your order #1234 has been shipped.", time: "2 hours ago", unread: true },
  { id: 2, text: "New offer: 20% off electronics!", time: "Yesterday", unread: true },
  { id: 3, text: "Your payment for order #1229 was successful.", time: "2 days ago", unread: false },
  { id: 4, text: "System update: We’ve improved our checkout flow.", time: "3 days ago", unread: false },
];

const container = document.getElementById("notificationsContainer");
const emptyState = document.getElementById("emptyState");
const markAllReadBtn = document.getElementById("markAllRead");
const clearAllBtn = document.getElementById("clearAll");

// Render notifications
function renderNotifications() {
  container.innerHTML = "";

  if (notifications.length === 0) {
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  notifications.forEach(n => {
    const notif = document.createElement("div");
    notif.className = "notification " + (n.unread ? "unread" : "");

    notif.innerHTML = `
      <img src="https://img.icons8.com/color/48/appointment-reminders.png" alt="icon">
      <div class="notification-content">
        <p>${n.text}</p>
        <span class="notification-time">${n.time}</span>
      </div>
      <button class="mark-read">${n.unread ? "Mark as Read" : "Unread"}</button>
      <button class="delete">Delete</button>
    `;

    // Mark read/unread
    notif.querySelector(".mark-read").addEventListener("click", () => {
      n.unread = !n.unread;
      renderNotifications();
    });

    // Delete notification
    notif.querySelector(".delete").addEventListener("click", () => {
      notifications = notifications.filter(x => x.id !== n.id);
      renderNotifications();
    });

    container.appendChild(notif);
  });
}

// Mark all as read
markAllReadBtn.addEventListener("click", () => {
  notifications = notifications.map(n => ({ ...n, unread: false }));
  renderNotifications();
});

// Clear all
clearAllBtn.addEventListener("click", () => {
  notifications = [];
  renderNotifications();
});

// Init
renderNotifications();
