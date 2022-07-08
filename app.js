const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const users = require('./routes/users');
const articles = require('./routes/articles');
const { login, createUser } = require('./controllers/users');
require('dotenv').config();

const { PORT = 3000, DB = 'mongodb://localhost:27017/newsdb' } = process.env;

const app = express();

// middlewares
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const auth = require('./middlewares/auth');
const error = require('./middlewares/error');

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to the MongoDB server
mongoose.connect(DB);

app.use(helmet());
app.use(limiter);

app.use(cors());
app.options('*', cors());

app.use(requestLogger); // enabling the request logger

// routes
app.post('/signin', login);
app.post('/signup', createUser);
app.use(auth);
app.use('/users', users);
app.use('/articles', articles);

app.use(errorLogger); // enabling the error logger
app.use(errors()); // celebrate error handler
app.use(error); // centralized handler

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
