const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();


const authRoutes = require('./routes/auth');
const classRoutes = require('./routes/class');
const unitRoutes = require('./routes/unit');
const sessionRoutes = require('./routes/session');
const commentRoutes = require('./routes/comment');
const lectureRoutes = require('./routes/lecture');

const app = express();
app.use(express.json());
app.use(cors());
app.use(session({
  secret: 'secret', // Use a secure secret in production
  resave: false,
  saveUninitialized: true,
}));

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/comments', lectureRoutes);
app.get("/", (req, res) => {
  res.send(`server is ready.`);
});

app.listen(5000, () => console.log('Server running on port 5000'));
