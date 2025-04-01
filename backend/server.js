/***************************************************
 server.js

 Main entry point Node + Express server.
****************************************************/
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const { Pool } = require('pg');
const path = require('path');

// Create the Express app
const app = express();
const port = process.env.PORT || 3000;

// Set up Helmet for security headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    },
  })
);

// PostgreSQL connection pool setup
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'hotelbookingdb',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Simple test route
app.get('/api/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as now');
    res.json({ message: 'API is working', serverTime: result.rows[0].now });
  } catch (err) {
    console.error('Error in test route:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Import route modules and pass the pool instance to them
const hotelChainRoutes = require('./routes/hotelChainRoutes.js');
const hotelRoutes = require('./routes/hotelRoutes.js');
const customerRoutes = require('./routes/customerRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js'); 
const bookingRoutes = require('./routes/bookingRoutes.js');
const rentingRoutes = require('./routes/rentingRoutes.js');

// Register routes with the pool attached via middleware
app.use('/api/hotelChains', hotelChainRoutes(pool));
app.use('/api/hotels', hotelRoutes(pool));
app.use('/api/customers', customerRoutes(pool));
app.use('/api/employees', employeeRoutes(pool));  
app.use('/api/bookings', bookingRoutes(pool));
app.use('/api/rentings', rentingRoutes(pool));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
