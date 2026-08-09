require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: true, credentials: false }));
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);

// Root health check
app.get("/", (req, res) => {
    res.json({ message: "MovieSphere Backend Running 🚀", status: "ok" });
});

// API health check endpoint
app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "MovieSphere API is healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err.message);
    res.status(500).json({ message: "Internal server error" });
});

const PORT = Number(process.env.PORT) || 5002;

app.listen(PORT, () => {
    console.log(`✅ Server Running on Port ${PORT}`);
});

// Looks up an embeddable official trailer through YouTube's supported API.
app.get("/api/movies/trailer", async (req, res, next) => {
    const title = String(req.query.title || "").trim();
    const year = String(req.query.year || "").trim();

    if (!title) {
        return res.status(400).json({ message: "A movie title is required" });
    }

    if (!process.env.YOUTUBE_API_KEY) {
        return res.status(503).json({
            message: "Trailer search is not configured",
            fallback: `https://www.youtube.com/results?search_query=${encodeURIComponent(`${title} ${year} official trailer`)}`
        });
    }

    try {
        const query = `${title} ${year} official trailer`;
        const url = new URL("https://www.googleapis.com/youtube/v3/search");
        url.search = new URLSearchParams({
            part: "snippet",
            q: query,
            type: "video",
            videoEmbeddable: "true",
            maxResults: "1",
            key: process.env.YOUTUBE_API_KEY
        });

        const response = await fetch(url);
        const data = await response.json();
        const videoId = data.items?.[0]?.id?.videoId;

        if (!response.ok || !videoId) {
            return res.status(404).json({
                message: "No embeddable trailer was found",
                fallback: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
            });
        }

        res.json({ videoId, title: data.items[0].snippet?.title || query });
    } catch (error) {
        next(error);
    }
});
