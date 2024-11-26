const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/TFN");

// Define the user schema
const userSchema = new mongoose.Schema({
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
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the user model
const User = mongoose.model('User', userSchema);

module.exports = User;
