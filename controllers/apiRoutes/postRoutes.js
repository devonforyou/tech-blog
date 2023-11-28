const express = require("express");
const router = express.Router();
const { Post } = require("../../models");

// GET route to retrieve all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET route to retrieve a specific post by post ID
router.get("/:postid", async (req, res) => {
  try {
    const posts = await Post.findByPk(req.params.postid);
    if (posts) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST route to create a new post and assign post to the user
router.post("/create/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const newPosts = await Post.create({
      ...req.body,
      // user_id: req.session.user_id,
      user_id: id,
    });
    res.status(201).json(newPosts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT route to update a post
router.put("/update/:postid", async (req, res) => {
  try {
    const [updated] = await Post.update(req.body, {
      where: { id: req.params.postid },
    });

    if (updated !== 0) {
      const updatedPost = await Post.findByPk(req.params.postid);
      res.status(200).json(updatedPost);
    } else {
      const existingPost = await Post.findByPk(req.params.postid);
      if (existingPost) {
        res.status(200).json({ message: "No update has been made." });
      } else {
        res.status(404).json({ error: "Post not found" });
      }
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE route to delete a Post
router.delete("/delete/:id", async (req, res) => {
  try {
    const postData = await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });
    if (postData) {
      res.status(204).json({ message: "Post deleted" });
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
