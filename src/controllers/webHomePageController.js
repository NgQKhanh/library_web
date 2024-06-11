
// http://localhost:3000/sendID

const model = require('../models/Model');

/* Hiển thị trang chủ --------------------------------------------------------*/
let getRFIDHomePage = async (req, res) =>
{
  const user = req.session.user;
  try
  {
    /* Lấy thông tin người dùng, thông tin phòng đọc */
    const borrowedBooks = await model.user_BorrowedBookList(user.id);
    const readingRoom = await model.ReadingRoomInfo();
    const reservation = await model.ReservationInfo();
    console.log(reservation);

    res.render('RFIDHomePage.ejs', { user , borrowedBooks, readingRoom, reservation});
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).send("Đã có lỗi xảy ra!");
  }
}

/* Hiển thị trang chủ ADMIN --------------------------------------------------------*/
let getAdminHomePage = async (req, res) =>
{
  const user = req.session.user;
  try
  {
    /* Lấy thông tin người dùng, thông tin phòng đọc */
    const borrowedBooks = await model.user_BorrowedBookList(user.id);
    const readingRoom = await model.ReadingRoomInfo();
    const reservation = await model.ReservationInfo();
    console.log(reservation);

    res.render('adminHomePage.ejs', { user , borrowedBooks, readingRoom, reservation});
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).send("Đã có lỗi xảy ra!");
  }
}

/* Hiển thị mượn/trả sách ----------------------------------------------------*/
function layout (req, res) 
{
  const pageLayout = req.query.page_layout;
  res.render(pageLayout);
};

/* Tìm tên sách --------------------------------------------------------------*/
async function getBookName (req, res)
{
  const { bookID } = req.body;
  try
  {
    /* Tìm tên sách trong db */
    const book = await model.findByBookID(bookID);
    res.json(book);
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).send("Đã có lỗi xảy ra!");
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

/* Tra cứu tài liệu ----------------------------------------------------------- */
async function search (req,res){
  try {
    const keyWord = req.query.key;
    const field = req.query.field;
    if(keyWord != ''){
      const bookData = await model.searchBook(keyWord,field);
      res.json(bookData);
    }
    else{
  
    }
  } 
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/* Hiển thị vị trí hiện tại của ESP32 --------------------------------------------*/
function location (req, res){
  console.log(req.body);
  res.status(200);
}

function showLocation (req, res)
{
  res.render('location');
}

function getdataGatheringPage (req, res)
{
  res.render('dataGatheringPage');
}

/* test function */
async function test (req,res){
  try {
    const bookData = await model.searchBookCopy(1);
    console.log(bookData);
    res.status(200).json({ message: 'Verify successfully.' });
  } 
  catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

function getTest (req, res)
{
  res.render('test');
}

module.exports = {
    getRFIDHomePage,
    layout,
    getBookName,
    confirmBorrow,
    confirmReturn,
    search,
    location,
    showLocation,
    getdataGatheringPage,
    getAdminHomePage,

    test,
    getTest
}