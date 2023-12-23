
const Model = require('../models/loginModel');

/* Hiển thị trang đăng nhập ----------------------------------*/
function login (req, res)
{
  res.render('login');
}

/* Xử lý yêu cầu đăng nhập ------------------------------------*/
async function authenticate (req, res){
  
    const user = req.body;
    try{
      /*  Xác nhận tên đăng nhập/mật khẩu */
       const auth = await Model.auth(user);
       if(!auth){
         res.send('Sai tên đăng nhập hoặc mật khẩu');
       }
      else {
        req.session.userLoggedin = true;
        req.session.userInfo = auth;
        res.redirect('/userPage');
      }
    }
    catch(error){
      console.error("Error: ", error);
      res.send('Lỗi server, vui lòng thử lại sau.');
    }
}

/* Đăng xuất ----------------------------------------------------*/
function logout (req, res) {
  if (req.session.userInfo) {
    delete req.session.userInfo;
    delete req.session.userLoggedin;
  }
  res.redirect('/login');
}

module.exports = {
  login,
  authenticate,
  logout,
}

