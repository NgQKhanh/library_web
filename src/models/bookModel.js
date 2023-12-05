
const sql = require('./database');

const Book = function(book){
  this.bookID = book.bookID;
};

Book.borrowedBook = (id, result) => {
  sql.query("SELECT * from `loan` WHERE userID = ?",id,(err, res) => {
      if (err) {
          result(err, null);
          return;
      }
      if (res && res.length)
      {
        const books = res.map(item => new Book({
          bookID: item.bookID,
        }));
          result(null, books)
          return;
      }else {
        result(null, []);
      }
      result(null, null);
  });
}

module.exports = Book;
