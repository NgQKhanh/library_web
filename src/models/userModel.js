
const sql = require('./database');

const Book = function(book){
  this.bookname = book.bookname;
};

const Reg = function(regInfo){
  this.date = regInfo.date;
  this.shift = regInfo.shift;
}

/*Lấy list sách đang mượn -------------- */
async function borrowedBookList (userID)
{
  try{
    const [rows] = await sql.execute(
      "SELECT books.tenSach FROM `loan` "+ 
      "JOIN `books` ON loan.bookID = books.bookID " +
      "WHERE loan.userID = ?",[userID]);

      if(!rows.length) return [];
      else{
          const books = rows.map(item => new Book({
            bookname: item.tenSach,
          }));
            return books;
        }
  }
  catch (error) 
  {
    console.error("Error in borrowedBook:", error);
    throw new Error("Error fetching borrowed book");
  }
}


/*lấy thông tin phòng đọc -------------- */
async function readingRoomInfo(userID) {
  try {

    /*Cập nhật ngày tháng đến hiện tại */
    const currentDate = new Date().toISOString().slice(0, 10);
    /* 
      Kiểm tra xem người dùng đã checkin phòng đọc chưa
      Kiểm tra số người trong phòng đọc tự do
      Lấy thông tin đăng ký
    */
    const [isCheckin] = await sql.execute("SELECT * FROM `reading room` WHERE userID = ?",[userID]);
    const [userNumber] = await sql.execute("SELECT * FROM `reading room` WHERE 1");
    const [regInfo] = await sql.execute(`SELECT * FROM \`registered room\` WHERE userID = '${userID}' AND date >= '${currentDate}'`);
    // console.log(isCheckin.length)
    // console.log(regInfo);

    let reg;
    if(!regInfo.length) reg = [];
    else
    {
      reg = regInfo.map(item => new Reg({
        date: item.date,
        shift: item.shift,
      }));
    }
    //console.log(reg)

    return {
      isCheckin: isCheckin.length,
      userNumber: userNumber.length,
      reg: reg,
    };
  } 
  catch (error) 
  {
    console.error("Error in readingRoomInfo:", error);
    throw new Error("Error fetching reading room info");
  }
}

/* Tìm tên sách bằng ID ---------------------*/
async function findByBookID (bookId)
{
  try{
    const [rows] = await sql.execute("SELECT * from `books` WHERE bookID = ?",[bookId]);
    if(!rows.length) return null;
    else{
      const book = new Book({
        bookname: rows[0].tenSach, 
      });
    return book;
    }
  }catch (error) {
      console.error("Error in findByBookID:", error);
      throw new Error("Error fetching book by ID");
  }
}

/* Cập nhật list sách mượn -------------- */
async function borrowUpdate(userID, bookIDs){
  try 
  {
    const borrowData = bookIDs.map(bookId => `('${userID}','${bookId}')`).join(',');
    const status = bookIDs.map(bookId => `'${bookId}'`).join(',');

    await sql.execute(`INSERT INTO \`loan\`(\`userID\`, \`bookID\`) VALUES ${borrowData}`);
    await sql.execute(`UPDATE \`books\` SET \`status\`='1' WHERE \`bookID\` IN (${status})`);
  } 
  catch (error) 
  {
    throw new Error("Error");
  }
}

/* Cập nhật trả sách -------------- */
async function returnUpdate(userID, bookIDs){
  try 
  {
    const status = bookIDs.map(bookId => `'${bookId}'`).join(',');
    const returnData = bookIDs.map(bookId => `bookID = '${bookId}'`).join(' OR ');

    await sql.execute(`DELETE FROM \`loan\` WHERE userID = '${userID}' AND ${returnData}`);
    await sql.execute(`UPDATE \`books\` SET \`status\`='0' WHERE \`bookID\` IN (${status})`);
  } 
  catch (error) 
  {
    console.error('Error:', error);
  }
}

/* Lấy thông tin đăng ký phòng đọc --------------- */
async function regInfo(){
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
    return(result)
  } 
  catch (error) 
  {
    console.error('Error:', error);
  }
}

/* Xác nhận đăng ký phòng đọc --------------- */
async function regConfirm(user, reg){
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

/* Hủy đăng ký phòng đọc --------------- */
async function regDelete(user){
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
  borrowedBookList,
  readingRoomInfo,
  findByBookID,
  borrowUpdate,
  returnUpdate,
  regInfo,
  regConfirm,
  regDelete,
}
