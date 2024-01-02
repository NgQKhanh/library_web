// http://localhost:3000/sendID

const model = require('../models/userModel');

/* Hiển thị trang chủ */
let getHomePage = async (req, res) =>
{
  const user = req.session.user;
  try
  {
    /* Lấy thông tin người dùng, thông tin phòng đọc */
    const borrowedBooks = await model.getBorrowedBookList(user.id);
    const readingRoom = await model.getReadingRoomInfo(user.id);

    res.render('homePage.ejs', { user , borrowedBooks, readingRoom });
  } 
  catch(error)
  {
    console.error("Error in borrowed book:", error);
    res.status(500).send("Đã có lỗi xảy ra!");
  }
}

/* Hiển thị mượn/trả sách */
function layout (req, res) 
{
  const pageLayout = req.query.page_layout;
  res.render(pageLayout);
};

/* Tìm tên sách */
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

/* Xác nhận mượn sách */
async function confirmBorrow (req,res){
  try {
    const user = req.session.user;
    const bookIDList = req.body.bookIDList;

    console.log('Received borrowBookList:', bookIDList);

    await model.borrowUpdate(user.id, bookIDList);
    // Phản hồi về client
    res.status(200).json({ message: 'Borrow confirmed successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/* Xác nhận trả sách */
async function confirmReturn (req,res){
  try {
    const user = req.session.user;
    const bookIDList = req.body.bookIDList;

    console.log('Received returnBookList:', bookIDList);

    await model.returnUpdate(user.id, bookIDList);
    // Phản hồi về client
    res.status(200).json({ message: 'Borrow confirmed successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports = {
    getHomePage,
    layout,
    getBookName,
    confirmBorrow,
    confirmReturn,
}