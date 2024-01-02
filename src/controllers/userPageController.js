const model = require('../models/userModel');

const Info = function(info){
  this.borrowedBookList = info.borrowedBookList,
  this.readingRoomInfo = info.readingRoomInfo;
  this.regInfo = info.regInfo;
};

/* Lấy thông tin người dùng/thông tin phòng đọc */
async function getInfo(req,res){
  const UID = req.body.userID;

  try
  {
    const borrowedBooks = await model.getBorrowedBookList(UID);
    const readingRoom = await model.getReadingRoomInfo(UID);
    const regInfo = await model.getRegInfo();
    
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

/* Xác nhận đăng ký phòng đọc */
async function confirmRegister (req,res){
  try {
    const user = req.session.userInfo;
    const reg = req.body;

    // console.log('ngày:', reg.date);
    // console.log('kíp:', reg.shift);
    // console.log('user: ', user);

    model.regConfirm(user,reg);

    res.redirect('userPage');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/* HỦY đăng ký phòng đọc */
async function deleteRegister (req,res){
  try {
    const user = req.session.userInfo;
    await model.regDelete(user);
    res.redirect('userPage');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
    confirmRegister,
    deleteRegister,
    getInfo,
}