
const sql = require('./database');


/* Lấy thông tin phòng đọc ----------------------------------------------- */
async function ReadingRoomInfo(req,res) {
  try {
    /* Kiểm tra số người trong phòng đọc tự do */
    const [userNumber] = await sql.execute("SELECT * FROM `reading_room` WHERE 1");
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
    const [rows] = await sql.execute("SELECT * from `book_copy` " +
                                      "JOIN `book` ON book_copy.id = book.id " +
                                      "WHERE book_copy.bookID = ?",[bookId]);
    if(!rows.length) return null;
    else{
      return(rows[0]);
    }
  }catch (error) {
      console.error("Error in findByBookID:", error);
      throw new Error("Error fetching book by ID");
  }
}

/* Tìm kiếm sách ---------------------------------------------------*/
async function searchBook (keyWord, field)
{
  try{
    const [rows] = await sql.execute(`SELECT * from book WHERE ${field} LIKE '%${keyWord}%'`);
    if(!rows.length) return [];
    else{
      const books = rows.map(item => ({
        id: item.id,
        bookName: item.bookName,
        author: item.author,
        publisher: item.publisher,
        category: item.category
      }));
      return books;
    }
  }catch (error) {
      console.error("Error in findByBookID:", error);
      throw new Error("Error fetching book by ID");
  }
}
/* Tìm kiếm bản sách ---------------------------------------------------*/
async function searchBookCopy (id)
{
  try{
    const [rows] = await sql.execute(`SELECT * from book_copy WHERE id = ${id}`);
    if(!rows.length) return [];
    else{
      const books = rows.map(item => ({
        bookID: item.bookID,
        status: item.status,
        id: item.id,
        location: item.location
      }));
      return books;
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
    console.error('Model error when confirm borrow book list:', error);
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
    console.error('Model error when confirm return book list:', error);
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
    console.error("Error when fetching reading room info:", error);
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
    console.error('Model error when user confirm reservation: ', error);
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
      "SELECT loan.borrowDate, DATE_ADD(loan.borrowDate, INTERVAL ? DAY) AS dueDate, book.bookName "+
      "FROM `loan` "+ 
      "JOIN `book_copy` ON loan.bookID = book_copy.bookID " +
      "JOIN `book` ON book_copy.id = book.id " +
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
  searchBook,
  searchBookCopy,

  user_BorrowedBookList,
  user_BorrowConfirm,
  user_ReturnConfirm,
  user_ReservationConfirm,
  user_ReservationDelete,
  user_ReservationInfo
}
