/***************************************************
 hotelRoutes.js

 Handles operations for "Hotel" entity:
  - Basic CRUD
  - Listing rooms by hotel
  - Creating rooms under a hotel
  - Using a view for aggregated capacity
****************************************************/
const express = require('express');

function hotelRoutes(pool) {
  const router = express.Router();

  // GET all hotels
  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM Hotel');
      res.json(rows);
    } catch (err) {
      console.error('Error fetching hotels:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // NEW: GET hotels by search criteria (optional filters: area and category)
  // e.g. GET /api/hotels/search?area=Ottawa&category=5
  router.get('/search', async (req, res) => {
    try {
      const { area, category } = req.query;
      let query = 'SELECT * FROM Hotel WHERE 1=1';
      let values = [];
      let paramIndex = 0;
      if (area) {
        paramIndex++;
        query += ` AND address ILIKE $${paramIndex}`;
        values.push(`%${area}%`);
      }
      if (category) {
        paramIndex++;
        query += ` AND category = $${paramIndex}`;
        values.push(category);
      }
      const { rows } = await pool.query(query, values);
      res.json(rows);
    } catch (err) {
      console.error('Error searching hotels:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET single hotel by ID
  router.get('/:id', async (req, res) => {
    try {
      const hotelId = parseInt(req.params.id, 10);
      const { rows } = await pool.query('SELECT * FROM Hotel WHERE hotel_id = $1', [hotelId]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Hotel not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error fetching hotel:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET rooms for a given hotel
  // e.g. GET /api/hotels/3/rooms
  router.get('/:id/rooms', async (req, res) => {
    try {
      const hotelId = parseInt(req.params.id, 10);
      const { rows } = await pool.query(
        'SELECT * FROM Room WHERE hotel_id = $1',
        [hotelId]
      );
      res.json(rows);
    } catch (err) {
      console.error('Error fetching rooms for hotel:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST create new room under a specific hotel
  // e.g. POST /api/hotels/3/rooms
  router.post('/:id/rooms', async (req, res) => {
    try {
      const hotelId = parseInt(req.params.id, 10);
      const { price, room_capacity, bed_count, is_extendable } = req.body;
      const query = `
        INSERT INTO Room (hotel_id, price, room_capacity, bed_count, is_extendable)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING room_id
      `;
      const values = [hotelId, price, room_capacity, bed_count, is_extendable];
      const { rows } = await pool.query(query, values);
      res.status(201).json({ room_id: rows[0].room_id });
    } catch (err) {
      console.error('Error creating room for hotel:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Example of retrieving aggregated capacity (if you have a view named AggregatedRoomCapacity)
  router.get('/:id/aggregatedCapacity', async (req, res) => {
    try {
      const hotelId = parseInt(req.params.id, 10);
      // Assuming your view has columns: (hotel_id, hotel_name, total_beds)
      const { rows } = await pool.query(
        `SELECT * FROM AggregatedRoomCapacity WHERE hotel_id = $1`,
        [hotelId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'No aggregated capacity found for this hotel' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error fetching aggregated capacity:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST create hotel
  router.post('/', async (req, res) => {
    try {
      const { chain_id, hotel_name, category, address, manager_id } = req.body;
      const query = `
        INSERT INTO Hotel (chain_id, hotel_name, category, address, manager_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING hotel_id
      `;
      const values = [chain_id, hotel_name, category, address, manager_id];
      const { rows } = await pool.query(query, values);
      res.status(201).json({ hotel_id: rows[0].hotel_id });
    } catch (err) {
      console.error('Error creating hotel:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT update hotel
  router.put('/:id', async (req, res) => {
    try {
      const hotelId = parseInt(req.params.id, 10);
      const { hotel_name, category, address, manager_id } = req.body;
      const query = `
        UPDATE Hotel
           SET hotel_name = $1,
               category = $2,
               address = $3,
               manager_id = $4
         WHERE hotel_id = $5
         RETURNING *
      `;
      const values = [hotel_name, category, address, manager_id, hotelId];
      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Hotel not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error updating hotel:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE a hotel
  router.delete('/:id', async (req, res) => {
    try {
      const hotelId = parseInt(req.params.id, 10);
      const { rowCount } = await pool.query('DELETE FROM Hotel WHERE hotel_id = $1', [hotelId]);
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Hotel not found' });
      }
      res.sendStatus(204);
    } catch (err) {
      console.error('Error deleting hotel:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}

module.exports = hotelRoutes;
