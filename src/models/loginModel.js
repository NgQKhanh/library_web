
const sql = require('./database');

const User = function(user){
    this.id = user.id;
    this.username = user.username;
};

async function findByUserID (userId)
{
  try{
    const [rows, fields] = await sql.execute("SELECT * from `users` WHERE userID = ?",[userId]);
    if(!rows.length) return null;
    else{
      const user = new User({
        id: rows[0].userID, 
        username: rows[0].hoTen, 
      });
    return user;
    }
  }catch (error) {
      console.error("Error in findByUserID:", error);
      throw new Error("Error fetching user by ID");
  }
}

module.exports = {
  findByUserID,
}
