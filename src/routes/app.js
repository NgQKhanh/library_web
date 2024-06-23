const express = require('express');
const router = express.Router();

const login = require('../controllers/appLoginController');
const userApp = require('../controllers/appController');

/* Người dùng đăng nhập app */
router.post('/login',login.authenticate);

/* Tìm tên sách */
router.get('/bookName',userApp.getBookName);

/* Lấy list sách mượn */
router.post('/getBBList', userApp.getBorrowedBookList);

/* Lấy thông tin phòng đọc */
router.get('/getRRInfo', userApp.getReadingRoomInfo);

/* Tìm kiếm tài liệu */
router.get('/search', userApp.searchBook);

/* Đăng ký phòng đọc */
router.post('/getRsvnInfo', userApp.getRsvnInfo);
router.post('/reservation', userApp.confirmReservation);
router.post('/delrsvn', userApp.delReservation);

/* self-service ______________________________________________________________________________________________ */

router.post('/RFIDlogin',login.authenticateRFID);
router.post('/confirmBorrow', userApp.confirmBorrow);
router.post('/confirmReturn', userApp.confirmReturn);

module.exports = router;