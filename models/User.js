const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema({
    googleId: String,
    name: String,
    email: String,
    accessToken: String,
    creationDate: String,
    expiryDate: String,
    photo: String
});

const User = mongoose.model('user', userSchema);
module.exports = User;