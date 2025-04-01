/***************************************************
 customerRoutes.js

 Handles operations for the "Customer" entity:
  - Basic CRUD (using SIN as the unique identifier)
  - Retrieve bookings & rentings for a customer
  - Registration and Login endpoints (login uses email & password)
****************************************************/
module.exports = function(pool) {
  const express = require('express');
  const router = express.Router();

  // Attach the pool instance to every request early via middleware
  router.use((req, res, next) => {
    req.pool = pool;
    next();
  });

  /**
   * GET all customers.
   */
  router.get('/', async (req, res) => {
    try {
      const { rows } = await req.pool.query(`SELECT * FROM Customer`);
      res.json(rows);
    } catch (err) {
      console.error('Error fetching customers:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET a single customer by SIN.
   */
  router.get('/:sin', async (req, res) => {
    try {
      const sin = req.params.sin;
      const { rows } = await req.pool.query(
        `SELECT * FROM Customer WHERE customer_sin = $1`,
        [sin]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error fetching customer:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET a customer's booking history.
   * i.e. GET /api/customers/CUST001/bookings
   */
  router.get('/:sin/bookings', async (req, res) => {
    try {
      const sin = req.params.sin;
      const query = `SELECT b.*
                       FROM Booking b
                      WHERE b.customer_sin = $1
                      ORDER BY b.start_date DESC`;
      const { rows } = await req.pool.query(query, [sin]);
      res.json(rows);
    } catch (err) {
      console.error('Error fetching customer bookings:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * GET a customer's renting history.
   * i.e GET /api/customers/CUST001/rentings
   */
  router.get('/:sin/rentings', async (req, res) => {
    try {
      const sin = req.params.sin;
      const query = `SELECT r.*
                       FROM Renting r
                      WHERE r.customer_sin = $1
                      ORDER BY r.start_date DESC`;
      const { rows } = await req.pool.query(query, [sin]);
      res.json(rows);
    } catch (err) {
      console.error('Error fetching customer rentings:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST register a new customer.
   * Expects:
   *  - customer_sin, full_name, address, email, phone, id_type, payment_info, password
   */
  router.post('/register', async (req, res) => {
    try {
      const {
        customer_sin,
        full_name,
        address,
        email,
        phone,
        id_type,
        payment_info,
        password
      } = req.body;
      
      // Insert the new customer into the database
      const query = `INSERT INTO Customer 
                       (customer_sin, full_name, address, email, phone, id_type, payment_info, password)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                     RETURNING customer_sin`;
      const values = [
        customer_sin,
        full_name,
        address,
        email,
        phone,
        id_type,
        payment_info,
        password
      ];
      const { rows } = await req.pool.query(query, values);
      res.status(201).json({ customer_sin: rows[0].customer_sin });
    } catch (err) {
      console.error('Error creating customer:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * POST customer login.
   * Expects:
   *  - email, password
   * Returns the customer data if authentication is successful.
   */
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      // Query for customer by email
      const query = `SELECT * FROM Customer
                       WHERE email = $1
                       LIMIT 1`;
      const { rows } = await req.pool.query(query, [email]);
      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      const customer = rows[0];
      // We will eventually compare hashed passwords but for now we use plaintext
      if (customer.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      // Authentication successful - return customer data
      res.json(customer);
    } catch (err) {
      console.error('Error during customer login:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * PUT update existing customer.
   * Allows updating full_name, address, email, phone, id_type, payment_info, and password.
   */
  router.put('/:sin', async (req, res) => {
    try {
      const sin = req.params.sin;
      const { full_name, address, email, phone, id_type, payment_info, password } = req.body;
      const query = `UPDATE Customer
                       SET full_name = $1,
                           address = $2,
                           email = $3,
                           phone = $4,
                           id_type = $5,
                           payment_info = $6,
                           password = $7
                     WHERE customer_sin = $8
                     RETURNING *`;
      const values = [full_name, address, email, phone, id_type, payment_info, password, sin];
      const { rows } = await req.pool.query(query, values);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error updating customer:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  /**
   * DELETE a customer.
   */
  router.delete('/:sin', async (req, res) => {
    try {
      const sin = req.params.sin;
      const { rowCount } = await req.pool.query(
        `DELETE FROM Customer WHERE customer_sin = $1`,
        [sin]
      );
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }
      res.sendStatus(204);
    } catch (err) {
      console.error('Error deleting customer:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
};
