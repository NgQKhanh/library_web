
const sql = require('./database');


/* Lấy thông tin phòng đọc ----------------------------------------------- */
async function ReadingRoomInfo(req,res) {
  try {
    /* Kiểm tra số người trong phòng đọc tự do */
    const [userNumber] = await sql.execute("SELECT * FROM `reading room` WHERE 1");
    return( {
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
async function ReservationInfo(req,res){
  try 
  {
    /* Cập nhật ngày tháng đến hiện tại */
    const currentDate = new Date().toISOString().slice(0, 10);
    /* Thông tin ngày, kíp đăng ký */
    const [result] = await sql.execute
    ( "SELECT date, " +
      "COUNT(CASE WHEN shift = 1 THEN 1 END) AS shift_1, "+
      "COUNT(CASE WHEN shift = 2 THEN 1 END) AS shift_2 " +
      "FROM `reservation` "+
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

/* Tìm tên sách bằng bookID ---------------------------------------------------*/
async function findByBookID (bookId)
{
  try{
    const [rows] = await sql.execute("SELECT * from `books` WHERE bookID = ?",[bookId]);
    if(!rows.length) return null;
    else{
      return({bookname: rows[0].bookName});

    }
  }catch (error) {
      console.error("Error in findByBookID:", error);
      throw new Error("Error fetching book by ID");
  }
}

/*
  *_______________________________________PHẦN LIÊN QUAN ĐẾN NGƯỜI DÙNG____________________________________________________
 */
  
/* Người dùng (userID) xác nhận MƯỢN sách --------------------------------------------------- */
async function user_BorrowConfirm(userID, bookIDs){
  try 
  { // Ngày mượn sách, cập nhật trạng thái đang mượn (status = 1)
    const currentDate = new Date().toISOString().slice(0, 10);
    const borrowData = bookIDs.map(bookId => `('${userID}','${bookId}','${currentDate}')`).join(',');
    const status = bookIDs.map(bookId => `'${bookId}'`).join(',');

    await sql.execute(`INSERT INTO \`loan\`(\`userID\`, \`bookID\`,\`borrowDate\`) VALUES ${borrowData}`);
    await sql.execute(`UPDATE \`books\` SET \`status\`='1' WHERE \`bookID\` IN (${status})`);
  } 
  catch (error) 
  {
    throw new Error("Error");
  }
}

/* Người dùng (userID) xác nhận TRẢ sách ------------------------------------------------------ */
async function user_ReturnConfirm(userID, bookIDs){
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

/* Lấy thông tin đặt chỗ của người dùng (userID) ----------------------------------------------- */
async function user_ReservationInfo(userID) {
  try {

    /* Cập nhật ngày tháng */
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    /* Lấy thông tin đặt chỗ*/
    const [rsvnInfo] = await sql.execute(`SELECT * FROM \`reservation\` WHERE userID = '${userID}' AND date >= '${tomorrowString}'`);
    
    let rsvn;
    if(!rsvnInfo.length) rsvn = [];
    else
    {
      rsvn = rsvnInfo.map(item => ({
        date: item.date,
        shift: item.shift,
      }));
    } 
    return {rsvn};
  } 
  catch (error) 
  {
    console.error("Error in readingRoomInfo:", error);
    throw new Error("Error fetching reading room info");
  }
}

/* Người dùng (userID) xác nhận ĐẶT chỗ phòng đọc ---------------------------------------------- */
async function user_ReservationConfirm(userID, date, shift){
  try 
  {

    await sql.execute
      (`INSERT INTO \`reservation\` ` +
       `(\`userID\`, \`date\`, \`shift\`) VALUES ` +
       `('${userID}', '${date}', ${shift});`);
  } 
  catch (error) 
  {
    console.error('Error:', error);
  }
}

/* Người dùng (userID) xác nhận HỦY đặt chỗ phòng đọc ------------------------------------------- */
async function user_ReservationDelete(userID){
  try 
  {
    await sql.execute("DELETE FROM `reservation` WHERE userID = ?", [userID]);
  } 
  catch (error) 
  {
    console.error('Error:', error);
  }
}

/*Lấy list sách người dùng (userID) đang mượn --------------------------------------------------- */
async function user_BorrowedBookList (userID)
{
  try{
    //Thời hạn mượn
    let dueDays = process.env.DUE_DAYS;

    const [rows] = await sql.execute(
      "SELECT books.bookName, loan.borrowDate, DATE_ADD(loan.borrowDate, INTERVAL ? DAY) AS dueDate FROM `loan` "+ 
      "JOIN `books` ON loan.bookID = books.bookID " +
      "WHERE loan.userID = ?",[dueDays, userID]);

      if(!rows.length) return [];
      else{
          const books = rows.map(item => ({
            bookName: item.bookName,
            borrowDate: item.borrowDate,
            dueDate: item.dueDate
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

module.exports = {
  ReadingRoomInfo,
  ReservationInfo,
  findByBookID,

  user_BorrowedBookList,
  user_BorrowConfirm,
  user_ReturnConfirm,
  user_ReservationConfirm,
  user_ReservationDelete,
  user_ReservationInfo
}
