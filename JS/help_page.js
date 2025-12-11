const API_BASE_URL = 'https://cartify.runasp.net/api';

// Show notification
function showNotification(message, type = 'success') {
  const notif = $('#notification');
  notif.text(message).attr('class', `notification ${type} show`);
  setTimeout(() => notif.removeClass('show'), 4000);
}

$(document).ready(function() {

  $('#supportForm').submit(function(e) {
    e.preventDefault();

    const data = {
      Name: $('#name').val().trim(),
      Email: $('#email').val().trim(),
      Subject: $('#subject').val().trim(),
      IssueCategory: parseInt($('#category').val(), 10),
      Message: $('#message').val().trim()
    };

    // Validate form
    if (!data.Name || !data.Email || !data.Subject || isNaN(data.IssueCategory) || !data.Message) {
      showNotification('Please fill all fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.Email)) {
      showNotification('Please enter a valid email address.', 'error');
      return;
    }

    // AJAX request without Authorization
    $.ajax({
      url: `${API_BASE_URL}/HelpPage/SubmitTicket`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(response) {
        showNotification('Ticket submitted successfully!', 'success');
        $('#supportForm')[0].reset();
      },
      error: function(xhr) {
        console.error(xhr);
        if(xhr.status === 0){
          showNotification('Network error: unable to reach server.', 'error');
        } else if(xhr.status >= 500){
          showNotification('Server error: please try again later.', 'error');
        } else {
          showNotification('Failed to submit ticket. Please check your inputs.', 'error');
        }
      }
    });
  });

  $('#openTicketBtn').click(() => showNotification('Fill the form below to open a support ticket.', 'success'));
  $('#chatSupportBtn').click(() => showNotification('Chat support is offline. Please submit a ticket.', 'error'));
  $('#callSupportBtn').click(() => showNotification('Call us at 1-800-123-4567. Support hours: Mon-Fri 9AM-6PM EST.', 'success'));

});
