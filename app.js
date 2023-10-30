const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const routes = require('./routes/index');
require('dotenv').config();

const { PORT = 3001, DB = 'mongodb://localhost:27017/newsdb' } = process.env;

const app = express();

// middlewares
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const error = require('./middlewares/error');

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to the MongoDB server
mongoose.connect(DB);

app.use(helmet());

app.use(cors());
app.options('*', cors());

app.use(requestLogger); // enabling the request logger

app.use(limiter);

// routes
app.use('/', routes);

app.use(errorLogger); // enabling the error logger
app.use(errors()); // celebrate error handler
app.use(error); // centralized handler

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
