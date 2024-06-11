
returnBookList = [];
updateReturnList();

/* Khi có socket event */
socket.on('ID', async (msg) => {
try {
    /* Gửi yêu cầu tìm tên sách */
    const response = await fetch('/bookName', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookID: msg }),
    });
    if (response.ok) 
    {
    /* Lấy dữ liệu từ response */
    const bookData = await response.json();
    const bookName = bookData.bookName;
    //console.log(bookName);

    /* Hiển thị danh sách sách muốn mượn */
    bookIDList.push(msg);
    returnBookList.push(bookData);
    updateReturnList();
    } 
    else
    {
    /* Cảnh báo */
    const responseData = await response.json();
    console.error('Error:', responseData.message);
    alert(`Error: ${responseData.message}`);
    }
} 
catch (error) 
{
    /* Lỗi hệ thống */
    console.error('Fetch error:', error);
    alert('An error occurred. Please try again.');
}
});

/* Hàm cập nhật danh sách tên sách */
function updateReturnList() {
    const container = document.getElementById('returnContainer');
    container.innerHTML = '';

    const ol = document.createElement('ol');
    returnBookList.forEach(bookName => {
        const li = document.createElement('li');
        li.textContent = bookName;
        ol.appendChild(li);
    });
    /* Thêm danh sách vào container */
    container.appendChild(ol);
}

/* Gửi list sách mượn về server */
const sendButton = document.getElementById('sendButton');
async function handleClick() {
    const response = await fetch('/confirmReturn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookIDList }),
    });
    if (response.ok) 
    {
        location.reload();
    } 
    else
    {
        alert('An error occurred. Please try again.');
    }
}
sendButton.addEventListener('click', handleClick);


