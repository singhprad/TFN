const mongoose = require('mongoose');

// Define the movie schema
const movieSchema = new mongoose.Schema({
    moviename: {
        type: String,
        required: true,
        trim: true
    },
    director: {
        type: String,
        required: true,
        trim: true
    },
    writer: {
        type: String,
        required: true,
        trim: true
    },
    stars: {
        type: [String], // Array of strings for multiple stars
        required: true
    },
    imdbrating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    summary: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        data: Buffer, // Store image as binary data
        contentType: String // Store image content type (e.g., 'image/jpeg')
    },
    vote: {
        type: Number,
        default: 0 // Default value is 0 if not specified
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the movie model
const Movie = mongoose.model('Movie', movieSchema);

// Export the Movie model
module.exports = Movie;
