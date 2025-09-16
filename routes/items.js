const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// POST /items
router.post('/', async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const item = new Item({ name, quantity, price });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
