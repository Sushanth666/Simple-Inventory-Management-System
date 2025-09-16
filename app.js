const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parses JSON and logs requests
app.use(express.json());
app.use(morgan(':method :url'));

// Routes
app.get('/', (req, res) => {
  res.send('Inventory API is Running');
});
app.get('/health', (req, res) => {
  res.json({ status: 'Server healthy', time: new Date().toISOString() });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Connection error:', err));

// Item Schema & Model
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});
const Item = mongoose.model('Item', itemSchema);

// Add an item
app.post('/items', async (req, res) => {
  try {
    const { name, quantity, price } = req.body;
    const item = new Item({ name, quantity, price });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
