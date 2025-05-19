require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const PORT = process.env.PORT
const authRoutes = require('./routes/authroute');
const bookRoutes = require('./routes/bookroute');
const searchRoutes = require('./routes/search');

const app = express();
app.use(express.json());
const MONGO_URI = process.env.MONGO_URI;

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api', searchRoutes);

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on ${PORT}`);
//     });
//   });
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });