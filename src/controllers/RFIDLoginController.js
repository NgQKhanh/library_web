// userController.js

const userModel = require('../models/userModel');

function login (req, res){
  res.render('login');
}

function authenticate (req, res){
    const { id } = req.body;

    userModel.findByUserID(id, (err, user) => {
      if (err) 
      {
        const message = 'Đã có lỗi xảy ra!';
        res.render('login',{message});
      } 
      else if(!user){
        const message =  'Người dùng chưa đăng ký!';
        res.render('login',{message});
      }
      else {
        req.session.loggedin = true;
        req.session.user = user;
        res.redirect('home');
      }
    });
}

function logout (req, res) {
  req.session.destroy((err) => {
    if (err) console.log("Lỗi");
    res.redirect('login');
})
}

module.exports = {
  login,
  authenticate,
  logout,
}

