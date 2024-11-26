const mongoose = require('mongoose');

// Define the schema for Booking
const bookingSchema = new mongoose.Schema({
    moviename: {
        type: String,
        required: true,
    },
    theatername: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt fields
});

// Create the model from the schema
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
