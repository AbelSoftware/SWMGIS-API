require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const route = require('./routes/baseroute');
const cookieParser = require('cookie-parser');
const connectSql = require('./helpers/dbseinst');

mongoose.Promise = global.Promise;
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

const app = express();

const allowedOrigins = ['http://localhost:4200', 'http://localhost:3000'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true); // Allow specific origins or requests without origin (e.g., Postman, curl)
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and credentials
};

// Middleware
app.use(morgan('dev'));
app.use(cors(corsOptions)); // Apply CORS with options
app.options('*', cors(corsOptions)); // Handle preflight requests globally

app.use(cookieParser());

// JSON and URL-encoded form data parsing
app.use(express.urlencoded({ extended: true, limit: '55550mb' }));
app.use(express.json({ limit: '10000mb', extended: true }));

// Static file handling
app.use('/images', express.static(path.join(__dirname, '/images')));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Routes
app.use('/api', route);

app.get('/', async (req, res, next) => {
  res.send('Welcome to PMS API');
});

// Catch Error 404
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handler Function
app.use((err, req, res, next) => {
  const error = app.get('env') === 'development' ? err : {};
  const status = err.status || 500;

  // Response to client
  res.status(status).json({
    status: status,
    message: error.message || 'Internal Server Error',
    data: [],
  });

  console.error(err);
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on http://${host}:${port}`);
  connectSql.getPool();
});
