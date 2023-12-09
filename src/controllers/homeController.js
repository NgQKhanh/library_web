
const bookModel = require('../models/userModel');

let getHomePage = async (req, res) =>
{
  const user = req.session.user;
  try{
    const borrowedBooks = await bookModel.borrowedBook(user.id);
    res.render('homePage.ejs', { user , borrowedBooks});
  } catch(error){
    console.error("Error in borrowed book:", error);
    res.status(500).send("An error occurred while fetching the book. Please try again later.");
  }
}

module.exports = {
    getHomePage,
}