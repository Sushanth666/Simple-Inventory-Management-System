const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ status: 'Server healthy', time: new Date().toISOString() });
});

module.exports = router;
