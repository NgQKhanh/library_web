
const Model = require('../models/loginModel');

const authRes = function(auth){
  this.status = auth.status,
  this.userID = auth.userID;
  this.username = auth.username;
};

/* Xử lý yêu cầu đăng nhập app ------------------------------------*/
async function authenticate (req, res){
  
    const user = req.body;
    try{
      /*  Xác nhận tên đăng nhập/mật khẩu */
       const auth = await Model.auth(user);
       if(!auth){ // Đăng không nhập thành công
        const aRes = new authRes({
          status: false, 
          userID: null, 
          username: null,
        });
         res.send(aRes);
       }
      else { //Đăng nhập thành công
        const aRes = new authRes({
          status: true, 
          userID: auth.id, 
          username: auth.username,
        });
        console.log("[App] login: " + aRes.username);
        res.send(aRes);
      }
    }
    catch(error){
      console.error("Error: ", error);
      res.send('Lỗi server, vui lòng thử lại sau.');
    }
}

/* Xử lý yêu cầu đăng nhập RFID ------------------------------------*/
async function authenticateRFID (req, res){
  
  const data = req.body;
  try{
    /*  Tìm id người dùng trong danh sách */
    const user = await Model.findByUserID(data.userId);
    if(!user){
      res.status(400).json({ success: false, message: 'Người dùng chưa đăng ký!' });
    }
    else {
      res.status(200).json({username:user.username});
    }
  }
  catch(error){
    console.error("Error in findByUserID:", error);
    res.status(500).json({ success: false, message: 'Lỗi server, vui lòng thử lại sau.' });
  }
}

module.exports = {
  authenticate,
  authenticateRFID
}

