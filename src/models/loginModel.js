
const sql = require('./database');

const User = function(user){
    this.id = user.id;
    this.username = user.username;
};
/* Xác thực người dùng khi quẹt thẻ */
async function findByUserID (userId)
{
  try{
    const [rows] = await sql.execute("SELECT * from `users` WHERE userID = ?",[userId]);
    if(!rows.length) return null;
    else{
      const user = new User({
        id: rows[0].userID, 
        username: rows[0].hoTen, 
      });
    console.log(user);
    return user;
    }
  }catch (error) {
      console.error("Error in findByUserID:", error);
      throw new Error("Error fetching user by ID");
  }
}

/* Xác thực người dùng khi đăng nhập */
async function auth (userAuth)
{
  try{
    const [rows] = await sql.execute(`SELECT * from \`users\` WHERE username = "${userAuth.username}" AND password = ${userAuth.password}`);
    //console.log(rows);
    if(!rows.length) return null;
    else{
      const user = new User({
        id: rows[0].userID, 
        username: rows[0].hoTen, 
      });
    console.log(user);
    return user;
    }
  }catch (error) {
      console.error("Error in findByUserID:", error);
      throw new Error("Error fetching user by ID");
  }
}

module.exports = {
  findByUserID,
  auth,
}
