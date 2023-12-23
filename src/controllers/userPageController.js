const model = require('../models/userModel');
const { use } = require('../routes/web');

/* Hiển thị trang người dùng */
let getUserPage = async (req, res) =>
{
  const user = req.session.userInfo;
  try
  {
    /* Lấy thông tin người dùng, thông tin đăng ký */
    const borrowedBooks = await model.borrowedBookList(user.id);
    const readingRoom = await model.readingRoomInfo(user.id);

    const regInfo = await model.regInfo();

    res.render('userPage.ejs', { user , borrowedBooks, readingRoom, regInfo });
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
    getUserPage,
    confirmRegister,
    deleteRegister,
}