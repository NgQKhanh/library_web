
//http://localhost:3000/api/login
const userModel = require('../models/loginModel');

function test (req, res)
{
  const messageData = req.body;

  console.log('dữ liệu từ ESP:', messageData);

  // Gửi tin nhắn đến tất cả các clients kết nối
   {
    // Gửi tin nhắn đến tất cả các clients kết nối
    io.emit('mes', messageData);

  }

  res.json({ success: true, message: 'Đã gửi thành công' });
}

async function authenticate (req, res){
  
    let { id } = req.body;

    // if(!id) {
    //     return res.status(200).json({
    //         message: 'mising parameter'})
    // }

     try{
      const user = await userModel.findByUserID(id);
      req.session.loggedin = true;
      req.session.user = user;
      console.log(user);
      // let user = await userModel.findByUserID(id);
      // if(user){
      //   const message =  "đăng nhập";
        //res.render('RFIDLogin',{message});
      }
    //   else {
    //     req.session.loggedin = true;  
    //     req.session.user = user;
    //     res.redirect('home');
    //   }
    //   return res.status(200).json({
    //     message: 'login ok'
    // })
    //}
    catch(error){
      console.error("Error in findByUserID:", error);
      res.status(500).send("An error occurred while fetching the user. Please try again later.");
    }
}

module.exports = {
    authenticate,
    test,
}