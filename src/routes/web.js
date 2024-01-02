const express = require('express');
const router = express.Router();
const controller = require('../controllers/homeController');
const authMiddleware = require('../middlewares/auth');
const RFIDLoginController = require('../controllers/RFIDLoginController');
const loginController = require('../controllers/loginController');
const userPageController = require('../controllers/userPageController');

/* Trang chủ */
router.get('/home', authMiddleware.loggedin, controller.getHomePage);

/* Quẹt thẻ đăng nhập */
router.get('/RFIDLogin', authMiddleware.isAuth, RFIDLoginController.login);
router.post('/RFIDLogin', RFIDLoginController.authenticate);
router.post('/RFIDLogout', RFIDLoginController.logout);

/* Hiển thị mượn/trả sách*/
router.get('/load-page', controller.layout);
router.post('/confirmBorrow', controller.confirmBorrow);
router.post('/confirmReturn', controller.confirmReturn);

/* Tìm tên sách */
router.post('/bookName',controller.getBookName);

/* Người dùng đăng nhập */
router.post('/login',loginController.authenticate);
router.post('/userPage', userPageController.getInfo);

/* Đăng ký phòng đọc */
router.post('/userPage', userPageController.confirmRegister);
router.post('/delreg', userPageController.deleteRegister);

module.exports = router;