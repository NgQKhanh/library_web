
const Model = require('../models/loginModel');

const authRes = function(auth){
  this.status = auth.status,
  this.userID = auth.userID;
  this.username = auth.username;
};

/* Xử lý yêu cầu đăng nhập ------------------------------------*/
async function authenticate (req, res){
  
    const user = req.body;
    try{
      /*  Xác nhận tên đăng nhập/mật khẩu */
       const auth = await Model.auth(user);

       if(!auth){ // Đăng nhập thành công
        const aRes = new authRes({
          status: false, 
          userID: null, 
          username: null,
        });
         res.send(aRes);
       }
      else { //Đăng nhập không thành công
        const aRes = new authRes({
          status: true, 
          userID: auth.id, 
          username: auth.username,
        });
         res.send(aRes);
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
  authenticate,
  logout,
}

