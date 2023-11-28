const router = require("express").Router();
const { User, Post, Comment } = require("../../models");

// GET redirect to homepage
router.get("/", (req, res) => {
  res.redirect("/homepage");
});

// GET homepage
// Navigate to /homepage and pull 20 posts to display along with username
router.get("/homepage", async (req, res) => {
  try {
    // Grab all posts from the database
    var posts = await Post.findAll();

    // Sort the posts from newest to oldest by date
    posts.sort((a, b) => b.updatedAt - a.updatedAt);

    // Limit the rendered output to 20 posts
    const postsData = posts.slice(0, 20).map((post) => ({
      postID: post.id,
      postTitle: post.postTitle,
      postDescription: post.postDescription,
      // take the post.updatedAt and cut it off at the 4th space and only take the first half
      timestamp: post.updatedAt.toLocaleString(),
      postUserId: post.user_id,
    }));

    // Take the creator userID for each post and find the username that matches the userID
    for (let i = 0; i < postsData.length; i++) {
      const userData = await User.findByPk(postsData[i].postUserId, {
        attributes: { exclude: ["password"] },
      });
      const user = userData.get({ plain: true });
      postsData[i].postUsername = user.username;
    }

    // Find all comments for each post and add them to the postsData
    for (let i = 0; i < postsData.length; i++) {
      const comments = await Comment.findAll({
        where: { post_id: postsData[i].postID },
      });

      for (let j = 0; j < comments.length; j++) {
        const usernameData = await User.findByPk(comments[j].user_id, {
          attributes: { exclude: ["password"] },
        });
        const username = usernameData.get({ plain: true });
        comments[j].commentUsername = username.username;
      }

      postsData[i].postComments = comments.map((comment) => ({
        commentText: comment.commentText,
        // look up the username for each comment from the user_id
        commentUsername: comment.commentUsername,
        commentDate: comment.updatedAt,
      }));
    }

    // organize the comments by date
    for (let i = 0; i < postsData.length; i++) {
      postsData[i].postComments.sort(
        (a, b) => a.commentDate - b.commentDate
      );
    }

    // convert the commentDate to a string
    for (let i = 0; i < postsData.length; i++) {
      for (let j = 0; j < postsData[i].postComments.length; j++) {
        postsData[i].postComments[j].commentDate =
          postsData[i].postComments[j].commentDate.toLocaleString();
      }
    }

    
    // Render the homepage with the postsData
    res.render("homepage", {
      styles: ["homepage", "posts", "search-bar"],
      scripts: ["homepage", "search-bar"],
      homepagePosts: postsData,
      user: {
        id: req.session.user_id,
        isLoggedIn: req.session.logged_in,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET navigation to user's post page
// Navigate to /posts/user and then redirect to /posts/user/:username once the username is known
router.get("/dashboard", async (req, res) => {
  try {
    // Log in Check, if not logged in, redirect to home page
    if (!req.session.logged_in) {
      return res.redirect("/");
    }

    // Find the user's username by the session user_id
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
    });
    const user = userData.get({ plain: true });

    // Redirect to /posts/user/:username
    res.redirect(`/dashboard/${user.username}`);
  } catch (err) {
    // Redirect to 404 page on error
    return res.status(404).json(err);
  }
});

// GET specific user's dashboard page
// Navigate to /posts/user/:username
router.get("/dashboard/:username", async (req, res) => {
  try {
    // Find the user's username by the session user_id
    const user = await User.findOne({
      where: {
        username: req.params.username,
      },
      attributes: { exclude: ["password"] },
    });

    // If the user does not exist, redirect to home page
    if (!user) {
      console.error(
        `The user with the provided username "${req.params.username}" does not exist.`
      );
      return res.redirect("/homepage");
    }

    // Find the user's posts
    const posts = await Post.findAll({
      where: { user_id: user.id },
    });

    // Find the comments for each post
    for (let i = 0; i < posts.length; i++) {
      const comments = await Comment.findAll({
        where: { post_id: posts[i].id },
      });

      // Add the comments to the postsData
      posts[i].postComments = comments.map((comment) => ({
        commentText: comment.commentText,
        commentDate: comment.updatedAt,
        user_id: comment.user_id,
      }));
    }

    // get the username for each comment from the user_id
    for (let i = 0; i < posts.length; i++) {
      for (let j = 0; j < posts[i].postComments.length; j++) {
        const usernameData = await User.findByPk(
          posts[i].postComments[j].user_id,
          {
            attributes: { exclude: ["password"] },
          }
        );
        const username = usernameData.get({ plain: true });
        posts[i].postComments[j].commentUsername = username.username;
      }
    }

    // Sort the comments from newest to oldest by date
    for (let i = 0; i < posts.length; i++) {
      posts[i].postComments.sort(
        (a, b) => a.commentDate - b.commentDate
      );
    }

    // convert the commentDate to a string
    for (let i = 0; i < posts.length; i++) {
      for (let j = 0; j < posts[i].postComments.length; j++) {
        posts[i].postComments[j].commentDate =

          posts[i].postComments[j].commentDate.toLocaleString();
      }
    }


    // Create an array of the posts data
    var postsData = posts.map((post) => ({
      postId: post.id,
      postTitle: post.postTitle,
      postDescription: post.postDescription,
      // Add the comments to the postsData
      postComments: post.postComments,
    }));

    // Render the dashboard with the postsData
    res.render("dashboard", {
      styles: ["dashboard", "homepage", "posts", "search-bar" ],
      scripts: ["dashboard", "homepage", "search-bar"],
      myPosts: postsData,
      user: {
        id: req.session.user_id,
        isLoggedIn: req.session.logged_in,
      },
    });
  } catch (error) {
    // Redirect to 404 page on error
    return res.status(404).json(error);
  }
});

module.exports = router;
