const express = require('express');
const router = express.Router();

const login = require('../controllers/appLoginController');
const userApp = require('../controllers/userAppController');
const model = require('../models/userModel');

/* Người dùng đăng nhập app */
router.post('/login',login.authenticate);

/* Lấy list sách mượn */
router.post('/getBBList', model.BorrowedBookList);

/* Lấy thông tin phòng đọc */
router.get('/getRRInfo',model.ReadingRoomInfo);

/* Đăng ký phòng đọc */
router.post('/userPage', userApp.confirmReservation);
router.post('/delreg', userApp.delReservation);

module.exports = router;