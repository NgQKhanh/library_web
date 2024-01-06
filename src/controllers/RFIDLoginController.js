
// http://localhost:3000/sendID

const userModel = require('../models/loginModel');

/* Hiển thị trang đăng nhập ----------------------------------*/
function getLoginPage (req, res)
{
  res.render('RFIDLogin');
}

/* Xử lý yêu cầu đăng nhập ------------------------------------*/
async function authenticate (req, res){
  
    const id = req.body;
    try{
      /*  Tìm id người dùng trong danh sách */
      const user = await userModel.findByUserID(id.id);
      if(!user){
        res.status(404).json({ success: false, message: 'Người dùng chưa đăng ký!' });
      }
      else {
        req.session.loggedin = true;
        req.session.user = user;
        res.json({ success: true, message: 'Đăng nhập thành công', redirectTo: '/home' });
      }
    }
    catch(error){
      console.error("Error in findByUserID:", error);
      res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau.' });
    }
}

/* Đăng xuất ----------------------------------------------------*/
function logout (req, res) {
  if (req.session.user) {
    delete req.session.user;
    delete req.session.loggedin;
  }
  res.redirect('/RFIDLogin');
}

module.exports = {
  getLoginPage,
  authenticate,
  logout,
}

