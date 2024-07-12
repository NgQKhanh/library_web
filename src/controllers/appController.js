const model = require('../models/Model');
const config = require('../config/config');
const fs = require('../models/FirebaseService');
const db = require('../config/database');
const { Op } = require('sequelize'); 

/* Lấy list sách mượn -----------------------------------------------------------------*/
async function getBorrowedBookList(req,res){
  // Lấy ID người dùng gửi lên
  const userID = req.body.userID; 
  try
  {
    // Lấy list sách mượn từ db
    const results = await db.models.Loan.findAll({
      where: { userID: userID },
      attributes: ['borrowDate', 'dueDate'],
      include: [
        {
          model: db.models.BookCopy,
          include: [
            {
              model: db.models.Book,
              attributes: ['bookName'],
              required: true
            }
          ],
          required: true
        }
      ]
    })

    const list = results.map(result => ({
      borrowDate: result.borrowDate,
      dueDate: result.dueDate,
      bookName: result.BookCopy.Book.bookName
    }));

    console.log(list);
    res.status(200).json({ borrowedBookList: list}); 
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).json({ error: "Server error"});
  }
}

/* Lấy thông tin phòng đọc -----------------------------------------------------------------*/
async function getReadingRoomInfo(req,res){
  const room = req.query.room;
  try
  {
    const result = await db.models.ReadingRoom.findOne({
      where: { room : room }
    })
    if(result != null){
      res.status(200).json(result); 
    } else {
      res.status(404).json({ error: "Not found"});
    } 
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).json({ error: "Server error"});
  }
}

/* Lấy thông tin số lượng đặt chỗ -----------------------------------------------------------------*/
async function getReservedSeatsCount(req,res){
  const room = req.body.room;
  try
  { /* Cập nhật ngày tháng đến hiện tại */
    const currentDate = new Date();
    //Lấy thông tin đặt chỗ từ db
    const query = `
      SELECT date, 
            COUNT(CASE WHEN shift = '1' THEN 1 END) AS shift_1, 
            COUNT(CASE WHEN shift = '2' THEN 1 END) AS shift_2 
      FROM reservation 
      WHERE date > ? 
      AND room = ?
      GROUP BY date`;

    db.sequelize.query(query, {
      replacements: [currentDate.toISOString().slice(0, 10), room],
      type: db.sequelize.QueryTypes.SELECT
    })

    //const reservationInfo = await model.ReservationInfo();


    const maxDay = config.getValue("rsvnPeriod");
    let j = 0;
    const dateArray = [];
    const shift1Array = [];
    const shift2Array = [];

    for (let i = 0; i <= maxDay; i++) { // Trong khoảng thời gian đăng ký
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

    /* Cập nhật ngày tháng */    
    const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1 )).toISOString().split('T')[0];
    const lastDate = new Date(new Date().setDate(new Date().getDate() + config.getValue("rsvnPeriod") )).toISOString().split('T')[0];

    /* Kiểm tra thông tin đặt chỗ người dùng*/
    const results = await db.models.Reservation.findAll({
      where: {
        userID: userID,
        date: {
          [Op.gte]: tomorrow // So sánh ngày lớn hơn hoặc bằng ngày mai
        }
      }
    })

    let userRerervstion;
    if(0 == results.length) userRerervstion = [];
    else
    {
      userRerervstion = results.map(item => ({
        date: item.date,
        shift: item.shift,
      }));
    } 
    
    for(i = 0; i < userRerervstion.length; i++){
      if(userRerervstion[i].date == date && userRerervstion[i].shift == shift)
        res.status(202).json({status:"duplicate"}); // Đăng ký trùng
    }

    if(userRerervstion.length >= config.getValue("maxOfRsvn")){
      res.status(201).json({status:"exceeded"}); //Quá số lượng đăng ký
    }
    else{      
      //Kiểm tra ngày được chọn có nằm trong khoảng được đăng ký không
      if(date >= lastDate || date < tomorrow) res.status(202).json({status:"unavailable"});
      else {
        await db.models.Reservation.create({
          userID: userID,
          date: date,
          shift: shift,
          seat: seat,
          room: room
        })
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
    
    const result = await db.models.Reservation.destroy({
      where: {
        userID: userID,
        date: new Date(date),
        shift: shift
      }
    })
    
    res.status(200).json({status:"Success"});
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
    const result = await db.models.BookCopy.findAll({
      where: { bookID: bookID },
      include: [
        {
          model: db.models.Book,
          required: true, 
        }
      ]
    })

    if(0 == result.length){
      res.status(404).json({ error: "Book Not found!"});
    }else{
      const book = result[0].toJSON();
       res.status(200).json({
        bookID : book.bookID,
        status : book.status,
        location : book.location,
        id: book.Book.id,
        bookName : book.Book.bookName,
        author : book.Book.author,
        publisher : book.Book.publisher,
        category : book.Book.category
       });
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
        const bookData = await db.models.Book.findAll({
          where: {
            [field]: {
              [Op.like]: `%${keyWord}%`
            }
          }
        });

        console.log("[App] search title: " + toString(bookData));
        res.send({list:bookData});
      }
    }
    else if (type == "copy")
    {
      const id = req.query.id;
      if(id != ''){
        const bookData  = await db.models.BookCopy.findAll({
          where: {
            id : id
          }
        });
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
    const userID = req.body.userID;
    const bookIDList = req.body.bList;

    console.log('userID:', userID);
    console.log('Received borrowBookList:', bookIDList);

    const currentDate = new Date();
    const dueDate = new Date(new Date().setDate(new Date().getDate() + config.getValue("borrowPeriod") ))

    const borrowData = bookIDList.map(bookId => ({
      userID: userID,
      bookID: bookId,
      borrowDate: currentDate,
      dueDate: dueDate
    }));
    
    await db.models.Loan.bulkCreate(borrowData)

    await db.models.BookCopy.update(
      { status: 1 }, // Cập nhật status thành 1
      {
        where: {
          bookID: {
            [Op.in]: bookIDList
          }
        }
      }
    )

    res.status(200).json({ message: 'Borrow success' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Server error"});
  }
}

/* Xác nhận trả sách --------------------------------------------------------- */
async function confirmReturn (req,res){
  try {
    const userID = req.body.userID;
    const bookIDList = req.body.rList;

    console.log('Received return:', bookIDList);

    await db.models.Loan.destroy({
      where: {
        userID: userID,
        bookID: {
          [Op.in]: bookIDList
        }
      }
    })

    await db.models.BookCopy.update(
      { status: 0 }, // Cập nhật status thành 0
      {
        where: {
          bookID: {
            [Op.in]: bookIDList
          }
        }
      }
    )

    //bookAvaiNotify(result);

    res.status(200).json({ message: 'Return success' });
  } 
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Server error"});
  }
}

/* Lấy thông tin đặt chỗ ngồi ở phòng đọc -----------------------------------------------------------------*/
async function getRsvnSeat(req,res){
  try
  {
    const date = req.query.date;
    const shift = req.query.shift;
    const room = req.query.room;

    const bSeat = await model.getRsvnSeatInfo(date, shift, room);
    res.status(200).json({bSeat}); 
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).json({ error: "Server error"});
  }
}

/* Đặt sách --------------------------------------------------------- */
async function reserveBook (req,res){
  try {
    const userID = req.query.userID;
    const bookID = req.query.bookID;

    const result = await model.user_reserveBook(userID, bookID);

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Server error"});
  }
}

/* Gửi thông báo sách đã có sẵn -----------------------------------------------------------------*/
async function bookAvaiNotify (data){
  try {
    data.forEach(item => {
      console.log("test here")
      const registrationToken = "ciCsCOoRTNydr412J2PiHy:APA91bG9-lIgSU978IYBafQe3qB6elJj5-rGnAB1vDq6bU9XaBWiQqdvzO4fvGb5hdG0Lc8OMvuDt92dttpPSbvGg5c4rHqWuZ13ZMkt1LwjlMVRW824ujrOyVy5Fe6Ic_Lv8HGMjnJD";
      fs.sendNotification(registrationToken, "Thông báo","Sách bạn đặt đã có sẵn trong thư viện!");
    });    
  } 
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: "Server error"});
  }
}

async function bookReservation (req,res){

  try {
    const newReservation = await db.models.BookRsvn.findAll({
      where: {
        id:1
      }
    });

    const arr = newReservation.map(reservation => reservation.toJSON());

    console.log('New BookReservation created:', arr);

    res.status(200).json({ message: "ok"});

  } catch (error) {
    res.status(500).json({ message: "fail" });
    console.error('Error creating BookReservation:', error);
  }
};

module.exports = {
    getBorrowedBookList,
    getReadingRoomInfo,
    getBookName,
    searchBook,

    getReservedSeatsCount,
    getRsvnSeat,
    confirmReservation,
    delReservation,

    confirmBorrow,
    confirmReturn,

    reserveBook,
    bookAvaiNotify,

    bookReservation,
}