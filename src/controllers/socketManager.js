
  //--------------- Gửi ID từ RFID reader ------------------
function sendID(app, io) {
  // http://localhost:3000/sendID
  app.post('/sendID', (req, res) => {
    const data = req.body.id;   
    io.emit('ID', data);
    res.json({ success: true, message: 'Sent ID to Socket.IO' });
  });
}

  //---------------- Gửi Location từ ESP32 -----------------
function sendLocation(app, io) {
  app.post('/location', (req, res) => {
    const data = req.body.location;   
    io.emit('location', data);
    res.json({ success: true, message: 'Sent Location to Socket.IO' });
  });
}

module.exports = {
  sendID,
  sendLocation,
};