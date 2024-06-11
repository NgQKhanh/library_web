
const socket = io();
let lineNumber = 1;
const allData = [];

document.getElementById('sendButton').addEventListener('click', function() {
    socket.emit('WTS', { message: 'Hello ESP32: Web send instruction' });
    const dataStatus = document.getElementById('dataStatus');
    dataStatus.textContent = `Đang lấy dữ liệu Location ${lineNumber}...`;
});

socket.on('STW/rssiArr', function(data) {
    const values = Object.values(data).map(Number);
    if (allData.length >= lineNumber) {
    allData[lineNumber - 1] = values;
    } else {
    allData.push(values);
    }

    const dataDisplay = document.getElementById('dataDisplay');
    const newData = document.createElement('div');
    newData.className = 'dataEntry';
    newData.textContent = `Location ${lineNumber}: ${JSON.stringify(values)}`;

    dataDisplay.appendChild(newData);

    lineNumber++;
    const dataStatus = document.getElementById('dataStatus');
    dataStatus.textContent = `Location ${lineNumber} sẵn sàng lấy`;
});

socket.on('STW/sample', function(data) {
    dataStatus.textContent = `Location ${lineNumber}: Sample: [${data}/3]`;
});

document.getElementById('saveButton').addEventListener('click', function() {
    let formattedData = "{\n";
    allData.forEach((entry, index) => {
    formattedData += `    { ${entry.join(', ')} }${index < allData.length - 1 ? ',' : ''}\n`;
    });
    formattedData += "};";

    const blob = new Blob([formattedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();

    URL.revokeObjectURL(url);
});

document.getElementById('deleteButton').addEventListener('click', function() {
    const dataDisplay = document.getElementById('dataDisplay');
    if (dataDisplay.children.length > 0) {
    dataDisplay.removeChild(dataDisplay.lastElementChild); // Xóa dòng dữ liệu cuối cùng
    allData.pop(); // Xóa dữ liệu cuối cùng khỏi mảng
    lineNumber--; // Giảm số dòng đi một
    dataStatus.textContent = `Đã xoá dữ liệu Location ${lineNumber}!`;
    }
});
