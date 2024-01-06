const model = require('../models/Model');

const Info = function(info){
  this.borrowedBookList = info.borrowedBookList,
  this.readingRoomInfo = info.readingRoomInfo;
  this.regInfo = info.regInfo;
};

const BBList = function(list){
  this.borrowedBookList = list.borrowedBookList;
};

const RRoom = function(room){
  this.borrowedBookList = list.borrowedBookList;
};

/* Lấy danh sách sách mượn -----------------------------------------------------------------*/
async function getBorrowedBookList(req,res){
  const UID = req.body.userID; // Lấy ID người dùng gửi lên
  try
  {
    const borrowedBooks = await model.BorrowedBookList(UID);    // Lấy list sách mượn từ db
    const list = new BBList({
        borrowedBookList: borrowedBooks,
      })
    res.send(list); // Trả về list sách mượn
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).send("Đã có lỗi xảy ra!");
  }
}

/* Lấy thông tin phòng đọc -----------------------------------------------------------------*/
async function getReadingRoomInfo(req,res){
  const UID = req.body.userID;
  try
  {
    const readingRoom = await model.ReadingRoomInfo(UID); 
    const info = new Info({
        borrowedBookList: borrowedBooks,
        //readingRoomInfo: readingRoom,
        //regInfo: regInfo,
      })
    res.send(info);
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).send("Đã có lỗi xảy ra!");
  }
}

/* Lấy thông tin đặt chỗ -----------------------------------------------------------------*/
async function getInfo(req,res){
  const UID = req.body.userID;
  try
  {
    const readingRoom = await model.ReadingRoomInfo(UID); 
    const info = new Info({
        borrowedBookList: borrowedBooks,
        //readingRoomInfo: readingRoom,
        //regInfo: regInfo,
      })
    res.send(info);
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).send("Đã có lỗi xảy ra!");
  }
}

/* Xác nhận đăng ký phòng đọc ----------------------------------------------------*/
async function confirmReservation (req,res){
  try {
    const user = req.session.userInfo;
    const reg = req.body;

    // console.log('ngày:', reg.date);
    // console.log('kíp:', reg.shift);
    // console.log('user: ', user);

    model.rsvnConfirm(user,reg);

    res.redirect('userPage');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/* HỦY đăng ký phòng đọc ----------------------------------------------------------- */
async function delReservation (req,res){
  try {
    const user = req.session.userInfo;
    await model.rsvnDelete(user);
    res.redirect('userPage');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
    getBorrowedBookList,
    confirmReservation,
    delReservation,
    getInfo,
}