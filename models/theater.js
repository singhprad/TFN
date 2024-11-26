const mongoose = require('mongoose');

// Define the theater schema
const theaterSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    theatername: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the theater model
const Theater = mongoose.model('Theater', theaterSchema);

module.exports = Theater;
