/***************************************************
 rentingRoutes.js

 Handles operations for "Renting":
  - Basic CRUD
  - "Checkout" logic with disallowing checkout for future rentings
****************************************************/
const express = require('express');

function rentingRoutes(pool) {
  const router = express.Router();

  // GET all rentings
  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM Renting');
      res.json(rows);
    } catch (err) {
      console.error('Error fetching rentings:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Get rentings (converted bookings) for a specific employee with customer full name
  router.get('/employee/:employeeSin', async (req, res) => {
    try {
      const employeeSin = req.params.employeeSin;
      const query = `
        SELECT r.*, c.full_name AS customer_full_name
          FROM Renting r
          JOIN Customer c ON r.customer_sin = c.customer_sin
        WHERE r.employee_sin = $1
        ORDER BY r.start_date DESC
      `;
      const { rows } = await pool.query(query, [employeeSin]);
      res.json(rows);
    } catch (err) {
      console.error('Error fetching rentings for employee:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


  // GET renting by ID
  router.get('/:id', async (req, res) => {
    try {
      const rentingId = parseInt(req.params.id, 10);
      const { rows } = await pool.query('SELECT * FROM Renting WHERE renting_id = $1', [rentingId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Renting not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error fetching renting:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST create renting
  router.post('/', async (req, res) => {
    try {
      const { customer_sin, room_id, employee_sin, start_date, end_date } = req.body;
      const query = `
        INSERT INTO Renting (customer_sin, room_id, employee_sin, start_date, end_date, archived)
        VALUES ($1, $2, $3, $4, $5, FALSE)
        RETURNING renting_id
      `;
      const values = [customer_sin, room_id, employee_sin, start_date, end_date];
      const { rows } = await pool.query(query, values);
      res.status(201).json({ renting_id: rows[0].renting_id });
    } catch (err) {
      console.error('Error creating renting:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT update renting
  router.put('/:id', async (req, res) => {
    try {
      const rentingId = parseInt(req.params.id, 10);
      const { customer_sin, room_id, employee_sin, start_date, end_date, archived } = req.body;
      const query = `
        UPDATE Renting
           SET customer_sin = $1,
               room_id = $2,
               employee_sin = $3,
               start_date = $4,
               end_date = $5,
               archived = $6
         WHERE renting_id = $7
         RETURNING *
      `;
      const values = [customer_sin, room_id, employee_sin, start_date, end_date, archived, rentingId];
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Renting not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error updating renting:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE renting
  router.delete('/:id', async (req, res) => {
    try {
      const rentingId = parseInt(req.params.id, 10);
      const { rowCount } = await pool.query('DELETE FROM Renting WHERE renting_id = $1', [rentingId]);
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Renting not found' });
      }
      res.sendStatus(204);
    } catch (err) {
      console.error('Error deleting renting:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST checkout: disallow checkout if current date is before renting's start_date
  router.post('/:rentingId/checkout', async (req, res) => {
    try {
      const rentingId = parseInt(req.params.rentingId, 10);
      const { rows } = await pool.query(
        'SELECT * FROM Renting WHERE renting_id = $1',
        [rentingId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Renting not found' });
      }
      const renting = rows[0];
      const currentDate = new Date().toISOString().split('T')[0];
      if (currentDate < renting.start_date) {
        return res.status(400).json({
          error: 'Cannot checkout a renting that has not started yet',
          renting_start_date: renting.start_date,
          current_date: currentDate
        });
      }
      const updateQuery = `
        UPDATE Renting
           SET end_date = CURRENT_DATE,
               archived = TRUE
         WHERE renting_id = $1
         RETURNING *
      `;
      const { rows: updatedRows } = await pool.query(updateQuery, [rentingId]);
      res.json({ message: 'Checkout successful', renting: updatedRows[0] });
    } catch (err) {
      console.error('Error checking out renting:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}

module.exports = rentingRoutes;
