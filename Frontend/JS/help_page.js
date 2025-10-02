// DOM elements
const notification = document.getElementById('notification');
const faqItems = document.querySelectorAll('.faq-item');
const supportForm = document.getElementById('supportForm');
const openTicketBtn = document.getElementById('openTicketBtn');
const chatSupportBtn = document.getElementById('chatSupportBtn');
const callSupportBtn = document.getElementById('callSupportBtn');

// Function to show notification
function showNotification(message, type) {
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  
  setTimeout(() => {
    notification.className = `notification ${type}`;
  }, 4000);
}

// FAQ accordion functionality
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  question.addEventListener('click', () => {
    // Close all other FAQ items
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
      }
    });
    
    // Toggle current item
    item.classList.toggle('active');
  });
});

// Support form submission
supportForm.addEventListener('submit', function(e) {
  e.preventDefault();
  
  // Get form data
  const name = document.getElementById('name').value;
  
  // In real app => send to backend
  showNotification(`Thank you, ${name}! Your support request has been submitted. We'll get back to you within 24 hours.`, 'success');
  
  // Reset form
  supportForm.reset();
});

// Support buttons functionality
openTicketBtn.addEventListener('click', () => {
  document.getElementById('subject').focus();
  showNotification('Please fill out the form below to open a support ticket.', 'success');
});

chatSupportBtn.addEventListener('click', () => {
  showNotification('Our chat support is currently offline. Please submit a support ticket or call us.', 'error');
});

callSupportBtn.addEventListener('click', () => {
  showNotification('Call us at 1-800-123-4567. Our support hours are Mon-Fri 9AM-6PM EST.', 'success');
});
