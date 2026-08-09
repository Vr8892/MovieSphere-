const express = require("express");

const router = express.Router();

const {
    listMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getMovieStats
} = require("../controllers/movieController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", listMovies);
router.get("/stats", getMovieStats);
router.get("/:id", getMovieById);
router.post("/", verifyToken, createMovie);
router.put("/:id", verifyToken, updateMovie);
router.delete("/:id", verifyToken, deleteMovie);

module.exports = router;