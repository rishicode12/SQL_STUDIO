const express = require('express');
const router = express.Router();
const { getHint } = require('../controllers/hintController');

// POST /api/hints
router.post('/', getHint);

module.exports = router;
