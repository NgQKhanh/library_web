// userController.js

const userModel = require('../models/loginModel');

//Hiển thị trang đăng nhập
function login (req, res)
{
  res.render('RFIDLogin');
}

// Xử lý yêu cầu đăng nhập
async function authenticate (req, res){
  
    const { id } = req.body;

    try{
      // Tìm id người dùng trong danh sách
      const user = await userModel.findByUserID(id);
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

// Đăng xuất
function logout (req, res) {
  req.session.destroy((err) => {
    if (err) console.log("Lỗi");
    res.redirect('RFIDLogin');
})
}


function test (req, res)
{
  res.render('test');
}

module.exports = {
  login,
  authenticate,
  logout,
  test,
}

