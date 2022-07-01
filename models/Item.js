const mongoose =  require('mongoose')

const itemsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    authors: {
        type: String,
        required: true,
        trim: true,
    },
    abstract: {
        type: String,
        required: true,
        trim: true,
    },
    googleId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Item = mongoose.model('item', itemsSchema);
module.exports = Item;