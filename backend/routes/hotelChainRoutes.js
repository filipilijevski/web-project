/***************************************************
 hotelChainRoutes.js

 Handles operations for the "HotelChain" entity:
  - Basic CRUD
  - Getting hotels by chain
  - Fetching hotel chain names for search functionality
****************************************************/

const express = require('express');

function hotelChainRoutes(pool) {
  const router = express.Router();

  // GET all hotel chains
  router.get('/', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM HotelChain ORDER BY chain_name');
      res.json(rows);
    } catch (err) {
      console.error('Error fetching hotel chains:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET all hotel chain names (For populating dropdown in search form)
  router.get('/names', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT chain_id, chain_name FROM HotelChain ORDER BY chain_name');
      res.json(rows);
    } catch (err) {
      console.error('Error fetching hotel chain names:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET single hotel chain by ID
  router.get('/:id', async (req, res) => {
    try {
      const chainId = parseInt(req.params.id, 10);
      const { rows } = await pool.query(
        'SELECT * FROM HotelChain WHERE chain_id = $1',
        [chainId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Hotel chain not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error fetching hotel chain:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // GET all hotels in a particular chain
  router.get('/:chainId/hotels', async (req, res) => {
    try {
      const chainId = parseInt(req.params.chainId, 10);
      const { rows } = await pool.query(
        'SELECT * FROM Hotel WHERE chain_id = $1 ORDER BY hotel_id',
        [chainId]
      );
      res.json(rows);
    } catch (err) {
      console.error('Error fetching hotels for chain:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // POST create new hotel chain
  router.post('/', async (req, res) => {
    try {
      const { chain_name, address, headquarters_address, contact_phone, contact_email } = req.body;
      const query = `
        INSERT INTO HotelChain (chain_name, address, headquarters_address, contact_phone, contact_email)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING chain_id
      `;
      const values = [chain_name, address, headquarters_address, contact_phone, contact_email];
      const { rows } = await pool.query(query, values);
      res.status(201).json({ chain_id: rows[0].chain_id });
    } catch (err) {
      console.error('Error creating hotel chain:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // PUT update existing hotel chain
  router.put('/:id', async (req, res) => {
    try {
      const chainId = parseInt(req.params.id, 10);
      const { chain_name, address, headquarters_address, contact_phone, contact_email } = req.body;

      const query = `
        UPDATE HotelChain
           SET chain_name = $1,
               address = $2,
               headquarters_address = $3,
               contact_phone = $4,
               contact_email = $5
         WHERE chain_id = $6
         RETURNING *
      `;
      const values = [chain_name, address, headquarters_address, contact_phone, contact_email, chainId];

      const { rows } = await pool.query(query, values);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Hotel chain not found' });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error('Error updating hotel chain:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // DELETE remove a hotel chain
  router.delete('/:id', async (req, res) => {
    try {
      const chainId = parseInt(req.params.id, 10);
      const { rowCount } = await pool.query(
        'DELETE FROM HotelChain WHERE chain_id = $1',
        [chainId]
      );
      if (rowCount === 0) {
        return res.status(404).json({ error: 'Hotel chain not found' });
      }
      res.sendStatus(204);
    } catch (err) {
      console.error('Error deleting hotel chain:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}

module.exports = hotelChainRoutes;
