const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeController');
const authMiddleware = require('../middlewares/auth');
const RFIDLoginController = require('../controllers/RFIDLoginController');

router.get('/home', authMiddleware.loggedin, controller.getHomePage);

router.get('/RFIDLogin', authMiddleware.isAuth, RFIDLoginController.login);
router.post('/RFIDLogin', RFIDLoginController.authenticate);
router.post('/RFIDLogout', RFIDLoginController.logout);

router.get('/test',RFIDLoginController.test);

module.exports = router;