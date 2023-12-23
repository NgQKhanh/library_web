// http://localhost:3000/sendID

function sendID(app, io) {

  //--------- Gửi ID từ RFID reader ---------
  app.post('/sendID', (req, res) => {
    const data = req.body.id;   
    io.emit('ID', data);
    res.json({ success: true, message: 'Message sent to Socket.IO' });
  });
}

module.exports = {
  sendID,
};