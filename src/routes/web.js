const express = require('express')
const {getHomePage, test} = require('../controllers/homeController');
const router = express.Router()

router.get('/', getHomePage)
router.get('/test', test)

module.exports = router;