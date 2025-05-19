const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: String,
  comment: String,
  rating: Number
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  reviews: [reviewSchema]
});

module.exports = mongoose.model('Book', bookSchema);
