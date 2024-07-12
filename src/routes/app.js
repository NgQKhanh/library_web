const express = require('express');
const router = express.Router();

const login = require('../controllers/appLoginController');
const userApp = require('../controllers/appController');

/* Người dùng đăng nhập app */
router.post('/login',login.MB_authenticate);   

/* Đăng nhập self-service */
router.post('/RFIDlogin',login.PC_authenticate);

/* Tìm tên sách */ 
router.get('/bookName',userApp.getBookName);

/* Lấy list sách mượn */
router.post('/getBBList', userApp.getBorrowedBookList);

/* Lấy thông tin phòng đọc */
router.get('/getRRInfo', userApp.getReadingRoomInfo);

/* Tìm kiếm tài liệu */
router.get('/search', userApp.searchBook);

/* Đăng ký phòng đọc */
router.post('/getRsvnCount', userApp.getReservedSeatsCount);
router.get('/getRsvnSeat', userApp.getRsvnSeat);
router.post('/cfrRsvn', userApp.confirmReservation);
router.post('/delRsvn', userApp.delReservation);

/* Xác nhận mượn/trả sách */
router.post('/confirmBorrow', userApp.confirmBorrow);
router.post('/confirmReturn', userApp.confirmReturn);

/* Đặt sách */
router.get('/reserveBook', userApp.bookReservation);

module.exports = router;