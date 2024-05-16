
// Kết nối đến server Socket.IO
const socket = io();

// Biến đếm số dòng
let lineNumber = 1;

// Biến lưu trữ dữ liệu
const allData = [];

// Thêm sự kiện bấm nút lấy dữ liệu
document.getElementById('sendButton').addEventListener('click', function() {
    // Gửi lệnh điều khiển ESP cho server
    socket.emit('WTS', { message: 'Hello ESP32: Web send instruction' });
    // Hiển thị trạng thái dữ liệu
    const dataStatus = document.getElementById('dataStatus');
    dataStatus.textContent = `Đang lấy dữ liệu Location ${lineNumber}`;
});

// Lắng nghe sự kiện từ server
socket.on('STW', function(data) {
    console.log(data);

    // Chuyển đổi dữ liệu thành mảng các giá trị
    const values = Object.values(data).map(Number);
    allData.push(values);

    // Hiển thị dữ liệu lên trang web, thêm dòng mới mỗi khi có dữ liệu mới
    const dataDisplay = document.getElementById('dataDisplay');
    const newData = document.createElement('div'); // Tạo một phần tử div mới để chứa dữ liệu
    newData.className = 'dataEntry'; // Thêm lớp CSS cho div mới
    newData.textContent = `Location ${lineNumber}: ${JSON.stringify(values)}`; // Chuyển đổi dữ liệu thành chuỗi JSON để hiển thị
    dataDisplay.appendChild(newData); // Thêm phần tử div mới vào dataDisplay

    // Tăng số dòng
    lineNumber++;
    const dataStatus = document.getElementById('dataStatus');
    dataStatus.textContent = `Location ${lineNumber} sẵn sàng lấy`;
});

// Thêm sự kiện bấm nút lưu dữ liệu
document.getElementById('saveButton').addEventListener('click', function() {
    // Chuyển đổi dữ liệu thành định dạng yêu cầu
    let formattedData = "{\n";
    allData.forEach((entry, index) => {
    formattedData += `    { ${entry.join(', ')} }${index < allData.length - 1 ? ',' : ''}\n`;
    });
    formattedData += "};";

    // Tạo một Blob từ chuỗi dữ liệu định dạng
    const blob = new Blob([formattedData], { type: 'application/json' });

    // Tạo URL cho Blob
    const url = URL.createObjectURL(blob);

    // Tạo một phần tử a và nhấp vào nó để tải xuống file
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();

    // Giải phóng bộ nhớ
    URL.revokeObjectURL(url);
});
