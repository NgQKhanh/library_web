const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeController');
const authMiddleware = require('../middlewares/auth');
const RFIDLoginController = require('../controllers/RFIDLoginController');

router.get('/home', authMiddleware.loggedin, controller.getHomePage);

router.get('/login', authMiddleware.isAuth, RFIDLoginController.login);
router.post('/login', RFIDLoginController.authenticate);
router.post('/logout', RFIDLoginController.logout);

module.exports = router;