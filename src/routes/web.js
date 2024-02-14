const express = require('express');
const router = express.Router();

const homePage = require('../controllers/homePageController');
const authMiddleware = require('../middlewares/auth');
const RFIDLogin = require('../controllers/RFIDLoginController');

/* Quẹt thẻ đăng nhập */
router.get('/RFIDLogin', authMiddleware.isAuth, RFIDLogin.getLoginPage);
router.post('/RFIDLogin', RFIDLogin.authenticate);
router.post('/RFIDLogout', RFIDLogin.logout);

/* Hiển thị trang chủ */
router.get('/home', authMiddleware.loggedin, homePage.getHomePage);

/* Xử lý mượn/trả sách*/
router.get('/load-page', homePage.layout);  //page layout hiển thị mượn/trả sách
router.post('/confirmBorrow', homePage.confirmBorrow);
router.post('/confirmReturn', homePage.confirmReturn);

/* Tìm tên sách */
router.post('/bookName',homePage.getBookName);

/* Tra cứu tài liệu */
router.get('/search',homePage.search)

/* test GET API*/
router.post('/test', homePage.test);

module.exports = router;