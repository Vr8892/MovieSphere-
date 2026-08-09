const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        year: {
            type: Number,
            required: true
        },
        genre: {
            type: String,
            required: true,
            trim: true
        },
        poster: {
            type: String,
            default: ""
        },
        rating: {
            type: Number,
            default: 0
        },
        runtime: {
            type: String,
            default: ""
        },
        plot: {
            type: String,
            default: ""
        },
        imdbId: {
            type: String,
            trim: true,
            unique: true,
            sparse: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Movie", movieSchema);