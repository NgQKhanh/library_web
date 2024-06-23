const express = require('express');
const router = express.Router();

const homePage = require('../controllers/webHomePageController');
const authMiddleware = require('../middlewares/auth');
const login = require('../controllers/webLoginController');

/* ADMIN ---------------------------------------------------------------------------------------*/

/* Admin đăng nhập */
router.get('/adminLogin', login.getAdminLoginPage);
//router.get('/adminLogin', authMiddleware.isAdminAuth, login.getAdminLoginPage);
router.post('/adminLogin', login.adminAuthenticate);
router.post('/adminLogout', login.adminLogout);

/* Hiển thị trang chủ Admin */
//router.get('/adminHome', authMiddleware.adminLoggedin, homePage.getAdminHomePage);
router.get('/adminHome', homePage.getAdminHomePage);

/* QUẸT THẺ RFID --------------------------------------------------------------------------------*/

/* Người dùng quẹt thẻ đăng nhập */
router.get('/RFIDLogin', authMiddleware.isRFIDAuth, login.getRFIDLoginPage);
router.post('/RFIDLogin', login.RFIDAuthenticate);
router.post('/RFIDLogout', login.RFIDLogout);

/* Hiển thị trang chủ người dùng */
router.get('/RFIDHome', authMiddleware.RFIDLoggedin, homePage.getRFIDHomePage);

/* Xử lý mượn/trả sách*/
router.get('/load-page', homePage.layout);  //page layout hiển thị mượn/trả sách
router.post('/confirmBorrow', homePage.confirmBorrow);
router.post('/confirmReturn', homePage.confirmReturn);

/* Tìm tên sách */
router.post('/bookName',homePage.getBookName);

/* Tra cứu tài liệu */
router.get('/search',homePage.search);

/*----------------------------------------------------------------------------------------------------
* Hiển thị vị trí thực của ESP32
*/
router.post('/location', homePage.location);
router.get('/location', homePage.showLocation);
router.get('/dataGathering', homePage.getdataGatheringPage);
//router.post('/dataGathering', homePage.getdataGatheringPage);

/* test GET API*/
router.post('/test', homePage.test);
router.get('/test', homePage.getTest);

module.exports = router;