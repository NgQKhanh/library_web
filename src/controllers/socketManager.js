// http://localhost:3000/sendUserID
// http://localhost:3000/sendBookID

function sendID(app, io) {

  //----- Gửi ID người dùng ---------
  app.post('/sendUserID', (req, res) => {
    const data = req.body.id;   
    io.emit('userID', data);
  
    res.json({ success: true, message: 'Message sent to Socket.IO' });
  });
  
  //-------- Gửi ID book ---------
  app.post('/sendBookID', (req, res) => {
    const data = req.body.id;   
    io.emit('bookID', data);  

    res.json({ success: true, message: 'Message sent to Socket.IO' });
  });
}

module.exports = {
  sendID,
};