const express = require('express');
const dotenv = require('dotenv');
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
/**
 * *Load env
 */
dotenv.config({ path: './config/config.env' });
const app = express();

//Body parser
app.use(express.json());
// Connect to DB
connectDB();

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

/**
 * *MOUNT routers
 */
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);

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
