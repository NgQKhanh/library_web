
const sql = require('./database');

const Book = function(book){
  this.bookname = book.bookname;
};

async function borrowedBook (userID)
{
  try{
    const [rows, fields] = await sql.execute("SELECT books.tenSach FROM `loan` JOIN `books` ON loan.bookID = books.bookID WHERE loan.userID = ?",[userID])
      if(!rows.length) return [];
      else{
          const books = rows.map(item => new Book({
            bookname: item.tenSach,
          }));
            return books;
        }
  }catch (error) {
    console.error("Error in borrowedBook:", error);
    throw new Error("Error fetching borrowed book");
  }
}

module.exports = {
  borrowedBook,
}
