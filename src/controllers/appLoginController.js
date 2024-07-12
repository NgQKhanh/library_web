
const { sequelize } = require('../config/database');
const User = require('../models/user')(sequelize);

const Model = require('../models/loginModel');

const authRes = function(auth){
  this.status = auth.status,
  this.userID = auth.userID;
  this.username = auth.username;
};

/* Xử lý yêu cầu đăng nhập app điện thoại ----------------------------------------------*/
async function MB_authenticate (req, res)
{  
    const user = req.body;
    try{
      /* Xác nhận tên đăng nhập/mật khẩu */
      const result = await User.findAll({
        where: {
          username: user.username,
          password: user.password
        }
      });

      if(0 == result.length){ 
        res.status(404).json({ message: "Not found!"});
      }
      else if(result.length > 1){
        res.status(500).json({ error: "Server error"});
      }
      else { 
        //Đăng nhập thành công
        res.status(200).json({
          userID: result[0].toJSON().userID, 
          username: result[0].toJSON().fullName,
        });
      }
    }
    catch(error){
      console.error("Error: ", error);
      res.status(500).json({ error: "Server error"});
    }
}

/* Xử lý yêu cầu đăng nhập RFID ở self service ----------------------------------------------*/
async function PC_authenticate (req, res)
{  
  const userID = req.body.userID;
  console.log(userID)
  try{
    /* Xác nhận ID */
    const result = await User.findAll({
      where: {
        userID: userID,
      }
    });

    if(0 == result.length){ 
      res.status(404).json({ message: "Not found!"});
    }
    else if(result.length > 1){
      res.status(500).json({ error: "Server error"});
    }
    else { 
      //Đăng nhập thành công
      res.status(200).json({
        username: result[0].toJSON().fullName,
      });
    }
  }
  catch(error){
    console.error("Error: ", error);
    res.status(500).json({ error: "Server error"});
  }
}

module.exports = {
  MB_authenticate,
  PC_authenticate,
}

