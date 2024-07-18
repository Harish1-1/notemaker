require('dotenv').config(); // Load environment variables at the top
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('./config/db');
const authRouter = require('./routes/auth');
const noteRouter = require('./routes/note');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

app.use(authRouter);
app.use(noteRouter);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
