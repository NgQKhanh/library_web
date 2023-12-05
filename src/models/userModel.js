
const sql = require('./database');

const User = function(user){
    this.id = user.id;
    this.username = user.username;
};

User.findByUserID = (id, result) => {
  sql.query("SELECT * from `users` WHERE userID = ?",id,(err, res) => {
      if (err) {
          result(err, null);
          return;
      }
      if (res.length) {
        const user = new User({
            id: res[0].userID, 
            username: res[0].hoTen, 
          });
          result(null, user)
          return;
      }
      result(null, null);
  });
}

module.exports = User;
