
const fs = require('../models/FirebaseService');

function testNotify (req, res)
{
    const registrationToken = "ciCsCOoRTNydr412J2PiHy:APA91bG9-lIgSU978IYBafQe3qB6elJj5-rGnAB1vDq6bU9XaBWiQqdvzO4fvGb5hdG0Lc8OMvuDt92dttpPSbvGg5c4rHqWuZ13ZMkt1LwjlMVRW824ujrOyVy5Fe6Ic_Lv8HGMjnJD"
    fs.sendNotification(registrationToken, "Thông báo","Sách bạn đặt đã có sẵn trong thư viện!");
    return( { message: "OK"});
}

module.exports = {
    testNotify,
}

