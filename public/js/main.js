$(document).ready(function () {
  // Enable tooltips everywhere
  var tooltipTriggers = document.querySelectorAll('[data-toggle="tooltip"]');
  for (var i = 0; i < tooltipTriggers.length; i++) {
    new bootstrap.Tooltip(tooltipTriggers[i]);
  }

  // Load the username and avatar to the navbar.  Only do this if the element is loaded
  if ($("#user-username").length) {
    // get the user's session data
    $.ajax({
      url: "/api/user/session/lookup",
      method: "GET",
    }).then(function (data) {
      if (data) {
        $("#user-username").text(`Hi, ${data.username}`);
      }
    });
  }
});
