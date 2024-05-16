
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
    const bookName = await model.findByBookID(bookID);
    res.json(bookName);
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
  const query = req.query.query;
  res.render('search', { results: [] });
}

/* Hiển thị vị trí hiện tại của ESP32 --------------------------------------------*/
function location (req, res){
  console.log(req.body);
  res.status(200).send("Coordinate updated");
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
function test (req, res)
{
  const { x, y } = req.body;
  userLocation = { x, y };
  res.send('Coordinate updated');

  console.log(req.body);
  res.status(200).send("ok");
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
    test,
    getTest,
    location,
    showLocation,
    getdataGatheringPage,
    getAdminHomePage,
}