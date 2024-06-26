const model = require('../models/Model');
const config = require('../controllers/config');

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
    res.status(500).json({ error: "Server error"});
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
    res.status(500).json({ error: "Server error"});
  }
}

/* Lấy thông tin số lượng đặt chỗ -----------------------------------------------------------------*/
async function getRsvnInfo(req,res){
  const room = req.body.room;
  try
  { //Lấy thông tin đặt chỗ từ db
    const reservationInfo = await model.ReservationInfo();

    const maxDay = config.getValue("rsvnPeriod");
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
      });
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).json({ error: "Server error"});
  }
}

/* Lấy thông đặt chỗ của người dùng -----------------------------------------------------------------*/
async function getRsvnInfo(req,res){
  const userID = req.body.userID;
  const room = req.body.room;
  try
  { //Lấy thông tin đặt chỗ từ db
    const reservationInfo = await model.ReservationInfo();
    const userReservation = await model.user_ReservationInfo(userID); 

    const maxDay = config.getValue("rsvnPeriod");
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
      });
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).json({ error: "Server error"});
  }
}

/* Xác nhận ĐẶT CHỖ phòng đọc -----------------------------------------------------------*/
async function confirmReservation (req,res){
  try {
    const userID = req.body.userID;
    const date = req.body.date;
    const shift = req.body.shift;
    const seat = req.body.seat;
    const room = req.body.room;

    const userRerervstion = await model.user_ReservationInfo(userID); 
    if(userRerervstion.rsvn.length >= config.getValue("maxOfRsvn")){
      res.status(201).json({status:"exceeded"}); //Quá số lượng đăng ký
    }
    else{
      //Kiểm tra ngày được chọn có nằm trong khoảng được đăng ký không
      const maxRsvnDay = new Date(new Date().setDate(new Date().getDate() +config.getValue("rsvnPeriod") )).toISOString().split('T')[0];
      if(date.split(' ')[0] >= maxRsvnDay) res.status(202).json({status:"unavailable"});
      else {
        model.user_ReservationConfirm(userID,date,shift,seat,room);
        res.status(200).json({status:"ok"});
      }
    }
  } 
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Server error"});
  }
}

/* HỦY đặt chỗ phòng đọc ----------------------------------------------------------- */
async function delReservation (req,res){
  try {
    const userID = req.body.userID;
    const date = req.body.date;
    const shift = req.body.shift;
    await model.user_ReservationDelete( userID, date, shift);
    res.status(200).json({status:"ok"});
  } 
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Server error"});
  }
}

/* Tìm tên sách ----------------------------------------------------------- */
async function getBookName (req,res){
  try
  {
    const bookID = req.query.bookID;
    /* Tìm tên sách trong db */
    const book = await model.findByBookID(bookID);
    if(!book){
      res.status(404).json({ error: "Book Not found!"});
    }else{
      res.status(200).json(book);
    }
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).json({ error: "Server error"});
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
    res.status(500).json({ error: "Server error"});
  }
}

/* Xác nhận mượn sách -------------------------------------------------------- */
async function confirmBorrow (req,res){
  try {
    const userId = req.body.userId;
    const bookIDList = req.body.bList;

    // console.log('Received borrowBookList:', bookIDList);
    // console.log('Received :', userId);

    //await model.user_BorrowConfirm(user.id, bookIDList);

    res.status(200).json({ message: 'Borrow success' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Server error"});
  }
}

/* Xác nhận trả sách --------------------------------------------------------- */
async function confirmReturn (req,res){
  try {
    const userId = req.body.userId;
    const bookIDList = req.body.rList;

    console.log('Received return:', bookIDList);
    console.log('Received :', userId);

   // await model.user_ReturnConfirm(user.id, bookIDList);

    res.status(200).json({ message: 'Return success' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Server error"});
  }
}

/* Lấy thông tin đặt chỗ ngồi ở phòng đọc -----------------------------------------------------------------*/
async function getBookingSeat(req,res){
  try
  {
    const date = req.query.date;
    const shift = req.query.shift;
    const room = req.query.room;

    const bSeat = await model.getBookingSeatInfo(date, shift, room); 
    //res.status(200).send(bSeat); 
    res.status(200).json({bSeat}); 
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).json({ error: "Server error"});
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
    getBookingSeat,
}