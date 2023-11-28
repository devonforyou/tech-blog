$(document).ready(function () {
  //  if any post is clicked on, expand the card to show the comments section
  $(".show-comment-btn").click(function () {
    // Find the sibling comment-section and toggle the show/hidden
    $(this).siblings(".comment-section").slideToggle();

    // change the text to hide comments
    $(this).text(function (i, text) {
      return text === "Hide Comments" ? "View Comments" : "Hide Comments";
    });
  });

  $(".add-comment-btn").click(function () {
    // if the add comment btn is clicked, take the text from text area, add it to the db and then append it to the comment section
    var commentText = $(this).siblings(".comment-text-form").val();
    var commentTextArea = $(this).siblings(".comment-text-form");
    var postId = $(this).closest(".post").data("postid");
    var commentSection = $(this).parents(".comment-section");
    var commentList = commentSection.children(".comment-list");

    // if the comment text is empty, don't do anything
    if (commentText === "") {
      return;
    }

    // if the comment text is not empty, add it to the db and then append it to the comment section
    $.ajax({
      url: "/api/comments/create/" + postId,
      method: "POST",
      data: {
        commentText: commentText,
      },
    }).then(function (data) {
      // if no-comment-message exists, remove it
      if (commentList.children(".no-comment-message").length > 0) {
        commentList.children(".no-comment-message").remove();
      }

      // append the comment to the comment list
      commentList.append(
        `<div class="comment card">
          <div class="comment-text">"${commentText}"</div>
          <div class="comment-username">- ${data.username}</div>
          <div class="comment-date">${data.createdAt}</div>
        </div>`
      );

      // clear the text area
      commentTextArea.val("");
    });

  });
  });
