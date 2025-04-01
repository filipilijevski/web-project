/***************************************************
 bookingRoutes.js

 Handles operations for "Booking":
  - Basic CRUD
  - Searching available rooms in a date range (extended search)
  - Converting booking -> renting
****************************************************/
const express = require('express');

function bookingRoutes(pool) {
  const router = express.Router();

  // GET all bookings
  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM Booking');
      res.json(rows);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // UPDATED ROUTE: Search for available rooms.
  // Now joins Room, Hotel, and HotelChain so that the result includes hotel_name and chain_name.
  router.get('/searchAvailable', async (req, res) => {
    try {
      const { start, end, capacity, minPrice, maxPrice, category, hotelChain } = req.query;
      let query = `
        SELECT r.*, h.category, h.address, h.hotel_name, hc.chain_name
          FROM Room r
          JOIN Hotel h ON r.hotel_id = h.hotel_id
          LEFT JOIN HotelChain hc ON h.chain_id = hc.chain_id
         WHERE NOT EXISTS (
           SELECT 1
             FROM Booking b
            WHERE b.room_id = r.room_id
              AND b.archived = FALSE
              AND NOT (b.end_date < $1::date OR b.start_date > $2::date)
         )
      `;
      let values = [start, end];
      let paramIndex = values.length;
      
      if (capacity) {
        paramIndex++;
        query += ` AND r.room_capacity = $${paramIndex}`;
        values.push(capacity);
      }
      if (minPrice) {
        paramIndex++;
        query += ` AND r.price >= $${paramIndex}`;
        values.push(minPrice);
      }
      if (maxPrice) {
        paramIndex++;
        query += ` AND r.price <= $${paramIndex}`;
        values.push(maxPrice);
      }
      if (category) {
        paramIndex++;
        query += ` AND h.category = $${paramIndex}`;
        values.push(category);
      }
      if (hotelChain) {
        paramIndex++;
        query += ` AND hc.chain_name = $${paramIndex}`;
        values.push(hotelChain);
      }
      
      const { rows } = await pool.query(query, values);
      res.json(rows);
    } catch (err) {
      console.error('Error searching available rooms:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // UPDATED ROUTE: Get upcoming bookings for a specific hotel, including client full name.
  // This joins Booking with Room and filters by the provided hotel_id and non-archived bookings with start_date >= CURRENT_DATE.
  router.get('/upcoming/hotel/:hotelId', async (req, res) => {
    try {
      const hotelId = req.params.hotelId;
      const query = `
        SELECT b.*, r.hotel_id, c.full_name AS customer_full_name
          FROM Booking b
          JOIN Room r ON b.room_id = r.room_id
          JOIN Customer c ON b.customer_sin = c.customer_sin
         WHERE r.hotel_id = $1
           AND b.start_date >= CURRENT_DATE
           AND b.archived = FALSE
         ORDER BY b.start_date ASC
      `;
      const { rows } = await pool.query(query, [hotelId]);
      res.json(rows);
    } catch (err) {
      console.error('Error fetching upcoming bookings for hotel:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET booking by ID
  router.get('/:id', async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id, 10);
      const { rows } = await pool.query(
        'SELECT * FROM Booking WHERE booking_id = $1',
        [bookingId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error fetching booking:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST create booking
  router.post('/', async (req, res) => {
    try {
      const { customer_sin, room_id, start_date, end_date } = req.body;
      const query = `
        INSERT INTO Booking (customer_sin, room_id, start_date, end_date, archived)
        VALUES ($1, $2, $3, $4, FALSE)
        RETURNING booking_id
      `;
      const values = [customer_sin, room_id, start_date, end_date];
      const { rows } = await pool.query(query, values);
      res.status(201).json({ booking_id: rows[0].booking_id });
    } catch (err) {
      console.error('Error creating booking:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT update booking
  router.put('/:id', async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id, 10);
      const { customer_sin, room_id, start_date, end_date, archived } = req.body;
      const query = `
        UPDATE Booking
           SET customer_sin = $1,
               room_id = $2,
               start_date = $3,
               end_date = $4,
               archived = $5
         WHERE booking_id = $6
         RETURNING *
      `;
      const values = [customer_sin, room_id, start_date, end_date, archived, bookingId];
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error updating booking:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE booking
  router.delete('/:id', async (req, res) => {
    try {
      const bookingId = parseInt(req.params.id, 10);
      const { rowCount } = await pool.query(
        'DELETE FROM Booking WHERE booking_id = $1',
        [bookingId]
      );
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      res.sendStatus(204);
    } catch (err) {
      console.error('Error deleting booking:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST convert booking to renting
  router.post('/:bookingId/convertToRenting', async (req, res) => {
    try {
      const bookingId = parseInt(req.params.bookingId, 10);
      const { employee_sin, new_start_date, new_end_date } = req.body; // now expecting both dates

      // Validate dates on the backend.
      const today = new Date().toISOString().split('T')[0];
      if (new_start_date !== today) {
        return res.status(400).json({ error: 'Start date must be today.' });
      }
      if (new_end_date <= today) {
        return res.status(400).json({ error: 'End date must be after today.' });
      }

      // 1 - Fetch booking
      const bookingQuery = 'SELECT * FROM Booking WHERE booking_id = $1';
      const { rows: bookingRows } = await pool.query(bookingQuery, [bookingId]);
      if (bookingRows.length === 0) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      const booking = bookingRows[0];

      // 2 - Archive the booking
      await pool.query(
        'UPDATE Booking SET archived = TRUE WHERE booking_id = $1',
        [bookingId]
      );

      // 3 - Insert a renting using the submitted dates
      const rentingQuery = `
        INSERT INTO Renting (customer_sin, room_id, employee_sin, start_date, end_date, archived)
        VALUES ($1, $2, $3, $4, $5, FALSE)
        RETURNING renting_id
      `;
      const rentingValues = [
        booking.customer_sin,
        booking.room_id,
        employee_sin,
        new_start_date,
        new_end_date
      ];
      const { rows: rentingRows } = await pool.query(rentingQuery, rentingValues);

      res.json({
        message: `Booking #${bookingId} converted to renting`,
        renting_id: rentingRows[0].renting_id,
      });
    } catch (err) {
      console.error('Error converting booking to renting:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}

module.exports = bookingRoutes;
