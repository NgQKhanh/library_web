const express = require('express');
const APIController = require('../controllers/APIController');

const router = express.Router();

router.get('/login', APIController.authenticate);
router.post('/test',APIController.test);

module.exports = router;