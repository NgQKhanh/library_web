
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
    console.log(data); 
    io.emit('location', data);
    res.status(200);
  });
}

// ---------------- Kết nối socket để điều khiển ESP32 -----------------
function SocketToESP32(app, io) {
  io.on('connection', function (socket) {
    // Lắng nghe sự kiện từ web
    socket.on('WTS', function () {
      io.emit('STE');
      console.log("Request ESP32 send data");
    });
   });
   app.post('/dataGathering', (req, res) => {
    const data = req.body;  
    console.log(data); 
    io.emit('STW', data);
    res.status(200);
  });
};

module.exports = {
  sendID,
  sendLocation,
  SocketToESP32,
};