$(document).ready(function () {
  // EVENT LISTENERS //
  // On any input into the search bar, filter the posts based on the search text
  $("#search-input").on("input", function () {
    const searchText = $(this).val().toLowerCase();
    const noResultsContainer = $(".no-results-container");
    let hasMatchingResults = false; // Flag to track if any matching results are found

    // Loop through each post and check if the search text is in the title, text, or timestamp
    $(".post").each(function () {
      const post = $(this);
      const cardTitle = post.find(".card-title").text().toLowerCase();
      const cardText =
        post.find(".card-text").text().toLowerCase() ||
        post.find("textarea").val().toLowerCase();
      const timestamp = post.find(".timestamp").text().toLowerCase();

      if (
        cardTitle.includes(searchText) ||
        cardText.includes(searchText) ||
        timestamp.includes(searchText)
      ) {
        post.css("display", "block");
        post.removeClass("no-results");
        hasMatchingResults = true; // Set flag to true if matching result is found
      } else {
        post.css("display", "none");
        post.addClass("no-results");
      }
    });

    // If no matching results are found, show the no results container
    if (hasMatchingResults) {
      noResultsContainer.addClass("no-results-container-noshow");
    } else {
      noResultsContainer.removeClass("no-results-container-noshow");
    }
  });
  // END EVENT LISTENERS //
});
