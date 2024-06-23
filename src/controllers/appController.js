const model = require('../models/Model');

/* Lấy danh sách sách mượn -----------------------------------------------------------------*/
async function getBorrowedBookList(req,res){
  // Lấy ID người dùng gửi lên
  const userID = req.body.userID; 
  try
  {
    // Lấy list sách mượn từ db
    const borrowedBooks = await model.user_BorrowedBookList(userID); 
    res.send({ borrowedBookList: borrowedBooks}); 
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).send("Đã có lỗi xảy ra!");
  }
}

/* Lấy thông tin phòng đọc -----------------------------------------------------------------*/
async function getReadingRoomInfo(req,res){
  const UID = req.body.userID;
  try
  { //Lấy thông tin phòng đọc từ db
    const readingRoom = await model.ReadingRoomInfo(UID); 
    res.send({ readingRoom: readingRoom});
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).send("Đã có lỗi xảy ra!");
  }
}

/* Lấy thông tin đặt chỗ -----------------------------------------------------------------*/
async function getRsvnInfo(req,res){
  const userID = req.body.userID;
  try
  { //Lấy thông tin đặt chỗ từ db
    const reservationInfo = await model.ReservationInfo();
    const userReservation = await model.user_ReservationInfo(userID); 

    const maxDay = process.env.MAX_DAY_RSVN;
    const currentDate = new Date();
    let j = 0;
    const dateArray = [];
    const shift1Array = [];
    const shift2Array = [];

    for (let i = 0; i <= maxDay; i++) {
      const tagretDate = new Date();
      tagretDate.setDate(currentDate.getDate() + i);
      dateArray[i] = tagretDate;

      const formattedTargetDate = tagretDate.toISOString().slice(0, 10);
      if(j < reservationInfo.length){
        if (formattedTargetDate === reservationInfo[j].date.toISOString().slice(0, 10)) {
          shift1Array[i] = reservationInfo[j].shift_1;
          shift2Array[i] = reservationInfo[j].shift_2;
          j++;
        } 
        else {
          shift1Array[i] = 0;
          shift2Array[i] = 0;
        }
      }
      else {
        shift1Array[i] = 0;
        shift2Array[i] = 0;
      }
    }

    res.send(
      {
        dateArray,
        shift1Array,
        shift2Array,
        userReservation,
      });
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).send("Đã có lỗi xảy ra!");
  }
}

/* Xác nhận ĐẶT CHỖ phòng đọc -----------------------------------------------------------*/
async function confirmReservation (req,res){
  try {
    const userID = req.body.userID;
    const date = req.body.date;
    const shift = req.body.shift;

    const userRerervstion = await model.user_ReservationInfo(userID); 
    if(userRerervstion.rsvn.length >= process.env.MAX_RESERVATION){
      res.send({status:"exceeded"});
    }
    else{
      const maxRsvnDay = new Date(new Date().setDate(new Date().getDate() + 6)).toISOString().split('T')[0];
      if(date.split(' ')[0] >= maxRsvnDay) res.send({status:"unavailable"});
      else {
        model.user_ReservationConfirm(userID,date,shift);
        res.send({status:"ok"});
      }
    }
  } 
  catch (error) {
    console.error('Error:', error);
    res.send({status:"error"});
  }
}

/* HỦY đặt chỗ phòng đọc ----------------------------------------------------------- */
async function delReservation (req,res){
  try {
    const userID = req.body.userID;
    console.log("UserID: " + req.body.userID + " hủy đăng ký");
    //const rsvn = req.rsvn;
    await model.user_ReservationDelete(userID);
    res.status(200);
  } 
  catch (error) {
    console.error('Error:', error);
    res.status(500);
  }
}

/* Tìm tên sách ----------------------------------------------------------- */
async function getBookName (req,res){
  try
  {
    const bookID = req.query.bookID;
    /* Tìm tên sách trong db */
    const book = await model.findByBookID(bookID);
    res.status(200).json(book);
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).send("Đã có lỗi xảy ra!");
  }
}

/* Tra cứu tài liệu ----------------------------------------------------------- */
async function searchBook (req,res){
  try {
    const type = req.query.type;
    if(type == "title")
    {
      const keyWord = req.query.key;
      const field = req.query.field;
      if(keyWord != ''){
        const bookData = await model.searchBook(keyWord,field);
        console.log("[App] search title: " + toString(bookData));
        res.send({list:bookData});
      }
    }
    else if (type == "copy")
    {
      const id = req.query.id;
      if(id != ''){
        const bookData = await model.searchBookCopy(id);
        console.log("[App] search Copy: " + toString(bookData));
        res.send({list:bookData});
      }
    }
  } 
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/* Xác nhận mượn sách -------------------------------------------------------- */
async function confirmBorrow (req,res){
  try {
    const user = req.session.user;
    const bookIDList = req.body.bookIDList;

    console.log('Received borrowBookList:', bookIDList);

    await model.user_BorrowConfirm(user.id, bookIDList);

    res.status(200).json({ message: 'Borrow confirmed successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/* Xác nhận trả sách --------------------------------------------------------- */
async function confirmReturn (req,res){
  try {
    const user = req.session.user;
    const bookIDList = req.body.bookIDList;

    console.log('Received returnBookList:', bookIDList);

    await model.user_ReturnConfirm(user.id, bookIDList);

    res.status(200).json({ message: 'Borrow confirmed successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
    getBorrowedBookList,
    getReadingRoomInfo,
    confirmReservation,
    delReservation,
    getRsvnInfo,
    getBookName,
    searchBook,
    confirmBorrow,
    confirmReturn,
}