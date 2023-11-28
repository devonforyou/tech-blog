$(document).ready(function () {
  defaultReadOnly();
  applyReadOnly();
  autoResizeText();

  // Prevent refresh on submission
  const preventDefault = (e) => {
    e.preventDefault();
  };

  $("form").submit(preventDefault);

  // EVENT LISTENERS //
  // ========================================================== //

  // Edit Post Button
  $(".card-icon-section .bi-pencil").click(async function (e) {
    // Check if the button is already in a disabled state
    if ($(this).hasClass("disabled")) {
      return;
    }

    const post = $(this).closest(".post");
    const postId = post.data("postid");

    const postTextInput = post.find(".card-text");
    const postTitleInput = post.find(".card-title");

    try {
      const response = await fetch(`/api/posts/${postId}`);

      if (response.ok) {
        // const postData = await response.json();
        enablePostEditing(post);

        // Toggles the buttons for the clicked post
        post.find(".save-btn, .discard-btn").slideToggle(200);

        // Checks if the clicked post is the active post
        if (activePost && activePost[0] === post[0]) {
          // Set the textarea to readonly
          postTextInput.prop("readonly", true);
          applyReadOnly();

          // Hides the buttons of the active post
          post.find(".save-btn, .discard-btn").slideUp(200);

          // Resets the active post
          activePost = null;
        } else {
          // Sets the active post
          activePost = post;
        }

        // Disables the button temporarily to prevent spamming and let buttons slide back up
        $(this).addClass("disabled");
        setTimeout(() => {
          $(this).removeClass("disabled");
        }, 200);

        post.find(".save-btn").click(async function () {
          try {
            // Send the PUT request to the backend
            const updatedTitle = postTitleInput.val();
            const updatedText = postTextInput.val();
            const putResponse = await fetch(`/api/posts/update/${postId}`, {
              method: "PUT",
              body: JSON.stringify({
                postTitle: updatedTitle,
                postDescription: updatedText,
              }), // Pass the updated text in the request body
              headers: {
                "Content-Type": "application/json",
              },
            });

          } catch (error) {
            console.log("failed to update the post:", error.message);
          }
        });
      } else {
        console.log("Post not found");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }

    // Attaches click event listener to the document
    $(document).on("click", function (e) {
      const target = $(e.target);
      const isPost = target.closest(".card").length > 0;

      // Checks if the click event occurred outside of the post elements
      if (!isPost) {
        $(".card-title, .card-text").prop("readonly", true);
        applyReadOnly();

        // Hides the buttons of the active post
        activePost.find(".save-btn, .discard-btn").slideUp(200);

        // Resets the active post
        activePost = null;

        // Removes the click event listener from the document
        $(document).off("click");
      }
    });

    // Prevent event bubbling to avoid immediate closing of the card
    e.stopPropagation();
  });

  // Delete Post Button
  $(".card-icon-section .bi-trash").click(async function (e) {
    // Check if the button is already in a disabled state
    if ($(this).hasClass("disabled")) {
      return;
    }
    const post = $(this).closest(".post");
    const postId = post.data("postid");

    try {
      const response = await fetch(`/api/posts/delete/${postId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // const postData = await response.json();
        post.remove();
      } else {
        console.error("Failed to delete the post.");
      }
    } catch (error) {
      console.error("Error occurred while deleting the post:", error);
    }
    e.stopPropagation();
  });

  // On input, resize the textarea so it fits the text
  $("textarea").on("input", autoResizeText);

  // add event listener to the new card button
  $("#create-new-post-btn").click(function () {
    // disabled the create new post button
    $("#create-new-post-btn").addClass("disabled");

    const newPostEl = $("#template-card-hidden").clone(true, true);

    newPostEl.removeAttr("id");
    // remove the hidden attr
    newPostEl.removeAttr("hidden");

    newPostEl.addClass("create-post-flag");
    newPostEl.find(".card-title").prop("readonly", false);
    newPostEl.find(".card-text").prop("readonly", false);
    newPostEl.find(".save-btn").css("display", "block");
    newPostEl.find(".discard-btn").css("display", "block");
    newPostEl.find(".card-title").removeClass("no-visibility");
    newPostEl.find(".card-text").removeClass("no-visibility");
    newPostEl.find(".card-title").val("");
    newPostEl.find(".card-text").val("");
    newPostEl.find(".card-title").attr("placeholder", "Title");
    newPostEl.find(".card-text").attr("placeholder", "Description");
    newPostEl.find(".card-title").focus();

    // add the post ID to the new post in the data-id attribute
    newPostEl.data("postid", "");

    // insert the new element to the page after the no results container
    $("#my-posts-area").prepend(newPostEl);
  });

  // save button event listener
  $(document).on("click", ".save-btn", function (event) {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var form = $(".needs-validation")[0];

    // If there is an invalid form, prevent the submit button from working and show the validation notes
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
      form.classList.add("was-validated");
    }
    // Otherwise, if the form is valid, send a PUT request with the info
    else {
      const postEl = $(this).closest(".post");
      const titleEl = postEl.find(".card-title");
      const textEl = postEl.find(".card-text");
      const title = titleEl.val();
      const text = textEl.val();
      const saveBtn = $(this);
      const discardBtn = postEl.find(".discard-btn");

      $.ajax({
        url: "/api/user/session/lookup",
        type: "GET",
      }).then(function (response) {
        var id = response.id;
        const postId = postEl.data("postid"); // Get post id

        // based on whether post exists or not set the method and url(put or post)
        const method = postId ? "PUT" : "POST";
        const url = postId
          ? `/api/posts/update/${postId}`
          : `/api/posts/create/${id}`;

        // Send request to the server
        $.ajax({
          url: url,
          type: method,
          data: {
            postTitle: title,
            postDescription: text,
          },
        }).then(function (response) {
          $("#create-new-post").removeClass("disabled");
          postEl.removeClass("create-post-flag");
          titleEl.prop("readonly", true);
          titleEl.addClass("no-visibility");
          textEl.prop("readonly", true);
          textEl.addClass("no-visibility");
          saveBtn.removeAttr("style");
          discardBtn.removeAttr("style");


            // If it was a new post
            postEl.data("postid", response.id); // Set the received id to the post

        });
      });
      // make the create new post button not disabled
      $("#create-new-post-btn").removeClass("disabled");
    }

  });

  // Discard Button Event Listener
  $(document).on("click", ".discard-btn", function () {
    // read the id from the data-id attribute
    const postEl = $(this).closest(".post");

    // get the id from the data-id attribute
    const id = postEl.data("postid");

    // if it doesnt exist it was the new post template so just remove the element and enable the create new post button
    if (id === "") {
      postEl.remove();
      // make the create new post button not disabled
      $("#create-new-post-btn").removeClass("disabled");
    } else {
      const titleEl = postEl.find(".card-title");
      const textEl = postEl.find(".card-text");
      const saveBtn = $(this).siblings(".save-btn");
      const discardBtn = $(this);

      // if the id is not empty, send a request to get the postTitle and postDescription
      $.ajax({
        url: `/api/posts/${id}`,
        type: "GET",
      }).then(function (response) {
        // set the values of the title and text to the postTitle and postDescription
        titleEl.val(response.postTitle);
        textEl.val(response.postDescription);
        // reset the form to the original state
        titleEl.prop("readonly", true);
        titleEl.addClass("no-visibility");
        textEl.prop("readonly", true);
        textEl.addClass("no-visibility");
        saveBtn.removeAttr("style");
        discardBtn.removeAttr("style");
      });
    }
  });

  // ========================================================== //
  // END EVENT LISTENERS //
});

// FUNCTIONS //
// ========================================================== //

// variables to make code cleaner later
let postTitle = $(".card-title");
let postText = $(".card-text");
let activePost = null;

// Sets all text areas to readonly by default
const defaultReadOnly = () => {
  postTitle.prop("readonly", true);
  postText.prop("readonly", true);
};

// Iterates over every post body and runs next function
const applyReadOnly = () => {
  postText.each((index, element) => {
    readOnlyAppearance($(element));
  });
};

// If an area is readonly, removes textarea appearance
const readOnlyAppearance = (postText) => {
  if (postText.prop("readonly")) {
    postText.addClass("no-visibility");
  } else {
    postText.removeClass("no-visibility");
  }
};

// resizes textarea/card based on text height inside
const autoResizeText = function () {
  $("textarea").each(function () {
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
};

function enablePostEditing(post) {
  // Disable editing on all posts
  postTitle.prop("readonly", true);
  postText.prop("readonly", true);

  // Enables editing on the clicked post
  const postTitleInput = post.find(".card-title");
  const postTextInput = post.find(".card-text");

  postTitleInput.prop("readonly", false);
  postTextInput.prop("readonly", false);
  applyReadOnly();
}
// ========================================================== //
// END FUNCTIONS //