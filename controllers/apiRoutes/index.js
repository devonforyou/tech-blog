const router = require("express").Router();
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");
const commentRoutes = require("./commentRoutes");

router.use("/user", userRoutes);
router.use("/posts", postRoutes);
router.use("/comments", commentRoutes);

// Catch-all route handler for undefined API routes
router.use((req, res) => {
    res.status(404).json({ error: 'API route not found' });
});

module.exports = router;
