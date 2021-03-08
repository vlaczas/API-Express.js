const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');
const reviews = require('./routes/reviews');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
/**
 * *Load env
 */
dotenv.config({ path: './config/config.env' });
const app = express();

//Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

// Connect to DB
connectDB();

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//SANITIZE Data
app.use(mongoSanitize());

//SET security headers
app.use(helmet());

// prevent XSS attacks
app.use(xss());

//rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
});
app.use(limiter);

//prevent http param pollution
app.use(hpp());

//enable cors
app.use(cors());

//file uploading
app.use(fileupload());

// set STATIC folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res
    .status(200)
    .send(
      '<a href="https://documenter.getpostman.com/view/13499056/Tz5jefjn#dc14aae5-8494-411f-ad2e-4409532f1b9b">Docs here</a>'
    );
});
/**
 * *MOUNT routers
 */
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

/**
 * !Error Handler Use
 */
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

/**
 * * Handle unhandled promise rejectrions
 */
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`.red);
  //close server and exit proccess
  server.close(() => {
    process.exit(1);
  });
});
