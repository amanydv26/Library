const express = require('express');
const Book = require('../models/book');
const auth = require('../middlewares/auth');
const router = express.Router();

// Add book
router.post('/', auth, async (req, res) => {
  const book = new Book(req.body);
  await book.save();
  res.json(book);
});

// Get all books with pagination + filters
router.get('/', async (req, res) => {
  const { page = 1, limit = 10, author, genre } = req.query;
  const filter = {};
  if (author) filter.author = author;
  if (genre) filter.genre = genre;

  const books = await Book.find(filter)
    .limit(limit * 1)
    .skip((page - 1) * limit);
  res.json(books);
});

// Get book by ID with avg rating and reviews
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  const avgRating = book.reviews.reduce((sum, r) => sum + r.rating, 0) / (book.reviews.length || 1);
  res.json({ ...book._doc, avgRating });
});

// Add a review
router.post('/:id/reviews', auth, async (req, res) => {
  const book = await Book.findById(req.params.id);
  const alreadyReviewed = book.reviews.find(r => r.user === req.user.id);
  if (alreadyReviewed) return res.status(400).send("Already reviewed");

  book.reviews.push({ user: req.user.id, ...req.body });
  await book.save();
  res.send("Review added");
});

// Update review
router.put('/reviews/:id', auth, async (req, res) => {
  const book = await Book.findOne({ "reviews._id": req.params.id });
  const review = book.reviews.id(req.params.id);
  if (review.user !== req.user.id) return res.status(403).send("Not allowed");
  Object.assign(review, req.body);
  await book.save();
  res.send("Review updated");
});

// Delete review
router.delete('/reviews/:id', auth, async (req, res) => {
  const book = await Book.findOne({ "reviews._id": req.params.id });
  const review = book.reviews.id(req.params.id);
  if (review.user !== req.user.id) return res.status(403).send("Not allowed");
  review.remove();
  await book.save();
  res.send("Review deleted");
});

module.exports = router;
