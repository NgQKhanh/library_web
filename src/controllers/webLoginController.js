
// http://localhost:3000/sendID

const userModel = require('../models/loginModel');

/* ---------------------------------------------------------------------------------------
/* RFID
/* -------------------------------------------------------------------------------------*/
/* Hiển thị trang đăng nhập RFID*/
function getRFIDLoginPage (req, res)
{
  res.render('RFIDLogin');
}

/* Xử lý yêu cầu đăng nhập RFID */
async function RFIDAuthenticate (req, res){
  
    const data = req.body;
    try{
      /*  Tìm id người dùng trong danh sách */
      const user = await userModel.findByUserID(data.id);
      if(!user){
        res.status(404).json({ success: false, message: 'Người dùng chưa đăng ký!' });
      }
      else {
        req.session.loggedin = true;
        req.session.user = user;
        res.json({ success: true, message: 'Đăng nhập thành công', redirectTo: '/RFIDHome' });
      }
    }
    catch(error){
      console.error("Error in findByUserID:", error);
      res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau.' });
    }
}

/* RFID đăng xuất */
function RFIDLogout (req, res) {
  if (req.session.user) {
    delete req.session.user;
    delete req.session.loggedin;
  }
  res.redirect('/RFIDLogin');
}

/* ---------------------------------------------------------------------------------------
/* ADMIN 
/* -------------------------------------------------------------------------------------*/
/* Hiển thị trang đăng nhập ADMIN */
function getAdminLoginPage (req, res)
{
  res.render('Admin/adminLogin');
}

/* Xử lý yêu cầu đăng nhập ADMIN */
async function adminAuthenticate (req, res){
   try{
      const { username, password } = req.body;

      if (username === 'admin' && password === '1') {
          res.json({ success: true });
      } else {
          res.json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' });
      }
    }
    catch(error){
      console.error("Error in findByUserID:", error);
      res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau.' });
    }
}

/* ADMIN đăng xuất ------------------------------------------------------------------*/
function adminLogout (req, res) {
  if (req.session.user) {
    delete req.session.user;
    delete req.session.loggedin;
  }
  res.redirect('/RFIDLogin');
}

module.exports = {
  getRFIDLoginPage,
  RFIDAuthenticate,
  RFIDLogout,

  getAdminLoginPage,
  adminAuthenticate,
  adminLogout,
}

