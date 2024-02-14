
// http://localhost:3000/sendID

const model = require('../models/Model');

/* Hiển thị trang chủ --------------------------------------------------------*/
let getHomePage = async (req, res) =>
{
  const user = req.session.user;
  try
  {
    /* Lấy thông tin người dùng, thông tin phòng đọc */
    const borrowedBooks = await model.user_BorrowedBookList(user.id);
    const readingRoom = await model.ReadingRoomInfo();
    const reservation = await model.ReservationInfo();
    console.log(reservation);

    res.render('homePage.ejs', { user , borrowedBooks, readingRoom, reservation});
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

/* Tra cứu tài liệu --------------------------------------------------------- */
async function search (req,res){
  const query = req.query.query;
  res.render('search', { results: [] });
}

/* test GET API */
function test (req, res)
{
  if (req.body.api_key !== process.env.API_KEY)
  return next(new AppError(400, 'API key mismatch'));
  console.log(req.body.station);
  const responseObject = {
    api_key: "kingdom12",
    station: req.body.station
  };
  res.status(200).send("ok");
}

module.exports = {
    getHomePage,
    layout,
    getBookName,
    confirmBorrow,
    confirmReturn,
    search,
    test
}