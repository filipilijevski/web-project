/***************************************************
 employeeRoutes.js

 Handles operations for the "Employee" entity:
  - Basic CRUD (using SIN as the unique identifier)
  - Registration and Login endpoints (login uses email & password)
  - Now includes hotel_id so that the employee object contains this property.
  - hotel_id is optional at registration; if not provided, it defaults to null.
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
     * GET all employees.
     */
    router.get('/', async (req, res) => {
      try {
        const { rows } = await req.pool.query(`SELECT * FROM Employee`);
        res.json(rows);
      } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  
    /**
     * GET a single employee by SIN.
     */
    router.get('/:sin', async (req, res) => {
      try {
        const sin = req.params.sin;
        const { rows } = await req.pool.query(
          `SELECT * FROM Employee WHERE employee_sin = $1`,
          [sin]
        );
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(rows[0]);
      } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  
    /**
     * POST register a new employee.
     * Expects:
     *  - employee_sin, full_name, address, email, password
     *  - hotel_id is optional; if not provided, defaults to null.
     */
    router.post('/register', async (req, res) => {
      try {
        const {
          employee_sin,
          full_name,
          address,
          email,
          hotel_id,
          password
        } = req.body;
        
        // Set hotel_id to null if it's not provided or empty
        const hotel = hotel_id && hotel_id.toString().trim() !== '' ? hotel_id : null;
        
        // Insert the new employee into the database, including hotel_id
        const query = `INSERT INTO Employee 
                         (employee_sin, full_name, address, email, hotel_id, password)
                       VALUES ($1, $2, $3, $4, $5, $6)
                       RETURNING employee_sin, full_name, address, email, hotel_id`;
        const values = [
          employee_sin,
          full_name,
          address,
          email,
          hotel,
          password
        ];
        const { rows } = await req.pool.query(query, values);
        res.status(201).json(rows[0]);
      } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  
    /**
     * POST employee login.
     * Expects:
     *  - email, password
     * Returns the employee data if authentication is successful.
     */
    router.post('/login', async (req, res) => {
      try {
        const { email, password } = req.body;
        // Query for employee by email
        const query = `SELECT * FROM Employee
                         WHERE email = $1
                         LIMIT 1`;
        const { rows } = await req.pool.query(query, [email]);
        if (rows.length === 0) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
        const employee = rows[0];
        // Compare hashed passwords later on, for now we have plaintext
        if (employee.password !== password) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Authentication successful; return employee data (including hotel_id)
        res.json(employee);
      } catch (err) {
        console.error('Error during employee login:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  
    /**
     * PUT update existing employee.
     * Allows updating full_name, address, email, hotel_id, and password.
     */
    router.put('/:sin', async (req, res) => {
      try {
        const sin = req.params.sin;
        const { full_name, address, email, hotel_id, password } = req.body;
        const hotel = hotel_id && hotel_id.toString().trim() !== '' ? hotel_id : null;
        const query = `UPDATE Employee
                         SET full_name = $1,
                             address = $2,
                             email = $3,
                             hotel_id = $4,
                             password = $5
                       WHERE employee_sin = $6
                       RETURNING *`;
        const values = [full_name, address, email, hotel, password, sin];
        const { rows } = await req.pool.query(query, values);
        if (rows.length === 0) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        res.json(rows[0]);
      } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  
    /**
     * DELETE an employee.
     */
    router.delete('/:sin', async (req, res) => {
      try {
        const sin = req.params.sin;
        const { rowCount } = await req.pool.query(
          `DELETE FROM Employee WHERE employee_sin = $1`,
          [sin]
        );
        if (rowCount === 0) {
          return res.status(404).json({ error: 'Employee not found' });
        }
        res.sendStatus(204);
      } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  
    return router;
  };
  