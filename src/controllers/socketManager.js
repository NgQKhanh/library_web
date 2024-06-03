
  //--------------- Kết nối socket cho RFID Reader ------------------
function socketRFID(app, io) {
  // http://localhost:3000/sendID
  // HTTP Post: ID ESP32 => Socket: webpage
  app.post('/sendID', (req, res) => {
    const data = req.body.id;   
    io.emit('ID', data);
    res.json({ success: true, message: 'Sent ID to Socket.IO' });
  });
}

// ---------------- Kết nối socket để điều khiển ESP32 -----------------
function socketIPS(app, io) {
  io.on('connection', function (socket) {

    // Web to server
    socket.on('WTS', function (payload) {
      io.emit('STE',{event: payload.event});
      console.log("[Socket] Request to ESP32" + String(payload.event));
    });

    // ESP32 to server
    socket.on('ETS', (payload) => {
      if(payload.event == "ON_location"){
        io.emit('STW/location', payload.data);
      }
      else if(payload.event == "OFF_rssiArr"){
        io.emit('STW/rssiArr', payload.data);
      }
      else if(payload.event == "OFF_sample"){
        io.emit('STW/sample', payload.data);
      }
   });
   });

  //  app.post('/dataGathering', (req, res) => {
  //   const data = req.body;  
  //   console.log(data); 
  //   io.emit('STW_data', data);
  //   res.status(200).json();
  // });
};


//---------------- HTTP POST: Location từ ESP32 => Socket: location page  -----------------
function sendLocation(app, io) {
  app.post('/location', (req, res) => {
    const data = req.body.location;  
    console.log(data); 
    io.emit('location', data);
    res.status(200).json();
  });
}

module.exports = {
  socketRFID,
  sendLocation,
  socketIPS,
};