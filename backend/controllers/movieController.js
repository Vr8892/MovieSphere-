const fs = require("fs/promises");
const path = require("path");
const { randomUUID } = require("crypto");

const localMoviesFile = path.join(__dirname, "..", "data", "movies.json");

const readLocalMovies = async () => {
    try {
        return JSON.parse(await fs.readFile(localMoviesFile, "utf8"));
    } catch (error) {
        if (error.code === "ENOENT") return [];
        throw error;
    }
};

const saveLocalMovies = async (movies) => {
    await fs.mkdir(path.dirname(localMoviesFile), { recursive: true });
    const temporaryFile = `${localMoviesFile}.tmp`;
    await fs.writeFile(temporaryFile, JSON.stringify(movies, null, 2), "utf8");
    await fs.rename(temporaryFile, localMoviesFile);
};

const toNumber = (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
};

const normalizeMovie = (movie) => ({
    id: movie._id?.toString?.() || movie.id,
    _id: movie._id?.toString?.() || movie.id,
    title: movie.title,
    year: movie.year,
    genre: movie.genre,
    poster: movie.poster || "",
    rating: movie.rating ?? 0,
    runtime: movie.runtime || "",
    plot: movie.plot || "",
    imdbId: movie.imdbId || "",
    createdAt: movie.createdAt,
    updatedAt: movie.updatedAt
});

const listMovies = async (req, res) => {
    try {
        const { search, genre, year } = req.query;
        const normalizedSearch = String(search || "").trim().toLowerCase();
        const normalizedGenre = String(genre || "").trim().toLowerCase();
        const normalizedYear = toNumber(year);

        const movies = await readLocalMovies();

        const filtered = movies.filter((movie) => {
            const title = String(movie.title || "").toLowerCase();
            const movieGenre = String(movie.genre || "").toLowerCase();
            const matchesSearch = !normalizedSearch || title.includes(normalizedSearch) || movieGenre.includes(normalizedSearch);
            const matchesGenre = !normalizedGenre || movieGenre.includes(normalizedGenre);
            const matchesYear = !normalizedYear || Number(movie.year) === normalizedYear;
            return matchesSearch && matchesGenre && matchesYear;
        });

        res.json({ count: filtered.length, movies: filtered.map(normalizeMovie) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;

        const movie = (await readLocalMovies()).find((entry) => entry._id === id || entry.id === id);

        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.json({ movie: normalizeMovie(movie) });
    } catch (error) {
        res.status(400).json({ message: "Invalid movie id" });
    }
};

const createMovie = async (req, res) => {
    try {
        const { title, year, genre, poster = "", rating = 0, runtime = "", plot = "", imdbId = "" } = req.body;

        if (!title || !year || !genre) {
            return res.status(400).json({ message: "Title, year, and genre are required" });
        }

        const payload = {
            title: String(title).trim(),
            year: toNumber(year),
            genre: String(genre).trim(),
            poster: String(poster).trim(),
            rating: toNumber(rating) ?? 0,
            runtime: String(runtime).trim(),
            plot: String(plot).trim(),
            imdbId: String(imdbId).trim()
        };

        if (!payload.year) {
            return res.status(400).json({ message: "Year must be a valid number" });
        }

        const movie = { _id: randomUUID(), ...payload };
        const movies = await readLocalMovies();
        movies.push(movie);
        await saveLocalMovies(movies);

        res.status(201).json({ message: "Movie created successfully", movie: normalizeMovie(movie) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = {};

        ["title", "genre", "poster", "runtime", "plot", "imdbId"].forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = String(req.body[field]).trim();
            }
        });

        if (req.body.year !== undefined) {
            const year = toNumber(req.body.year);
            if (!year) {
                return res.status(400).json({ message: "Year must be a valid number" });
            }
            updates.year = year;
        }

        if (req.body.rating !== undefined) {
            const rating = toNumber(req.body.rating);
            if (rating === undefined) {
                return res.status(400).json({ message: "Rating must be a valid number" });
            }
            updates.rating = rating;
        }

        const movies = await readLocalMovies();
        const index = movies.findIndex((entry) => entry._id === id || entry.id === id);

        if (index === -1) {
            return res.status(404).json({ message: "Movie not found" });
        }

        const updatedMovie = { ...movies[index], ...updates, _id: movies[index]._id || id };
        movies[index] = updatedMovie;
        await saveLocalMovies(movies);

        res.json({ message: "Movie updated successfully", movie: normalizeMovie(updatedMovie) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;

        const movies = await readLocalMovies();
        const remainingMovies = movies.filter((entry) => entry._id !== id && entry.id !== id);

        if (remainingMovies.length === movies.length) {
            return res.status(404).json({ message: "Movie not found" });
        }

        await saveLocalMovies(remainingMovies);
        res.json({ message: "Movie deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMovieStats = async (req, res) => {
    try {
        const movies = await readLocalMovies();

        const total = movies.length;
        const genres = movies.reduce((accumulator, movie) => {
            const list = String(movie.genre || "")
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);

            list.forEach((genre) => {
                accumulator[genre] = (accumulator[genre] || 0) + 1;
            });

            return accumulator;
        }, {});

        res.json({
            totalMovies: total,
            uniqueGenres: Object.keys(genres).length,
            genres
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    listMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
    getMovieStats
};