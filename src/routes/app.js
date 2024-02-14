const express = require('express');
const router = express.Router();

const login = require('../controllers/appLoginController');
const userApp = require('../controllers/userAppController');

/* Người dùng đăng nhập app */
router.post('/login',login.authenticate);

/* Lấy list sách mượn */
router.post('/getBBList', userApp.getBorrowedBookList);

/* Lấy thông tin phòng đọc */
router.get('/getRRInfo', userApp.getReadingRoomInfo);

/* Đăng ký phòng đọc */
router.post('/getRsvnInfo', userApp.getRsvnInfo);
router.post('/reservation', userApp.confirmReservation);
router.post('/delrsvn', userApp.delReservation);

module.exports = router;