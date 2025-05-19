const express = require('express');
const Book = require('../models/book');
const router = express.Router();

router.get('/search', async (req, res) => {
  const { q } = req.query;
  const books = await Book.find({
    $or: [
      { title: new RegExp(q, 'i') },
      { author: new RegExp(q, 'i') }
    ]
  });
  res.json(books);
});

module.exports = router;
