
const connection = require('../models/database');
const bookModel = require('../models/bookModel');

let getHomePage = async (req, res) =>
{
  const user = req.session.user;
  try{
    const borrowedBooks = await new Promise((resolve, reject) => {
      bookModel.borrowedBook(user.id, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.render('homePage.ejs', { user, borrowedBooks });
  } catch(e){
      console.log(e);
  }
}

module.exports = {
    getHomePage,
}