const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Post = require("../models/Post");
const validateUser = require("../middleware/validateUser");

// @route   POST /api/posts/create
// @desc    Create a new post (image + text)
// @access  Private
router.post(
  "/create",
  validateUser,
  [
    body("text", "Text is required").notEmpty(),
    body("image", "Image (base64) is required").notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { text, image } = req.body;

      const newPost = new Post({
        user: req.user.id,
        text,
        image,
      });

      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// @route   GET /api/posts/getallposts
// @desc    Get all posts
// @access  Public
router.get("/getallposts", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name email");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
