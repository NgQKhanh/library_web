
const sql = require('./database');

const Rsvn = function(rsvnInfo){
  this.date = rsvnInfo.date;
  this.shift = rsvnInfo.shift;
}

/*Lấy list sách đang mượn ------------------------------------------------ */
async function BorrowedBookList (req, res)
{
  try{
    const userID = req.body.userID;
    const [rows] = await sql.execute(
      "SELECT books.tenSach FROM `loan` "+ 
      "JOIN `books` ON loan.bookID = books.bookID " +
      "WHERE loan.userID = ?",[userID]);

      if(!rows.length) return [];
      else{
          const books = rows.map(item => item.tenSach);
            res.send(books);
        }
  }
  catch (error) 
  {
    console.error("Error in borrowedBook:", error);
    throw new Error("Error fetching borrowed book");
  }
}

/* Lấy thông tin phòng đọc ----------------------------------------------- */
async function ReadingRoomInfo(req,res) {
  try {
    /* Kiểm tra số người trong phòng đọc tự do */
    const [userNumber] = await sql.execute("SELECT * FROM `reading room` WHERE 1");
    res.send( {
      userNumber: userNumber.length,
    });
  } 
  catch (error) 
  {
    console.error("Error in readingRoomInfo:", error);
    throw new Error("Error fetching reading room info");
  }
}

/* Lấy thông tin đăng ký phòng đọc ------------------------------------------ */
async function RsvnInfo(req,res){
  try 
  {
    /* Cập nhật ngày tháng đến hiện tại */
    const currentDate = new Date().toISOString().slice(0, 10);
    /* Thông tin ngày, kíp đăng ký */
    const [result] = await sql.execute
    ( "SELECT date," +
      "COUNT(CASE WHEN shift = 1 THEN 1 END) AS shift_1,"+
      "COUNT(CASE WHEN shift = 2 THEN 1 END) AS shift_2" +
      " FROM \`registered room\` "+
      "WHERE date > ? " +  
      "GROUP BY date",
      [currentDate]
      );
    res.send(result)
  } 
  catch (error) 
  {
    console.error('Error:', error);
  }
}

/* Xác nhận đăng ký phòng đọc --------------------------------------------- */
async function rsvnConfirm(user, res){
  try 
  {
    await sql.execute
      (`INSERT INTO \`registered room\` ` +
       `(\`userID\`, \`date\`, \`shift\`) VALUES ` +
       `('${user.id}', '${reg.date}', ${reg.shift});`);
  } 
  catch (error) 
  {
    console.error('Error:', error);
  }
}

/* Hủy đăng ký phòng đọc ------------------------------------------------ */
async function rsvnDelete(user){
  try 
  {
    await sql.execute("DELETE FROM `registered room` WHERE userID = ?", [user.id]);
  } 
  catch (error) 
  {
    console.error('Error:', error);
  }
}

module.exports = {
  BorrowedBookList,
  ReadingRoomInfo,
  RsvnInfo,

  rsvnConfirm,
  rsvnDelete,
}
