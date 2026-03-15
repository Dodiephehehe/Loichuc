// Thiết lập hội thoại
const dialogueTree = {
    start: {
        text: "Xin chào! Bạn có muốn nhận một lời chúc đặc biệt từ tôi không?",
        choices: [
            { text: "Nhận lời chúc.", nextId: "redirect_lời_chúc" },
            { text: "Bỏ qua.", action: "runAway" } // Gán hành động "runAway" cho nút này
        ]
    }
};

// Khai báo các biến và phần tử HTML
const dialogueText = document.getElementById('dialogue-text');
const choiceContainer = document.getElementById('choice-container');
const dialogueBox = document.getElementById('dialogue-box');
const gameContainer = document.getElementById('game-container');
const blipSound = new Audio('blip.mp3'); // Load âm thanh

let currentDialogueId = 'start';
let isTyping = false;
let typeInterval;
let runAwayButton; // Biến lưu nút "Bỏ qua"

// --- Hàm bắt đầu hội thoại ---
function startDialogue() {
    dialogueBox.classList.remove('hidden'); // Hiện khung hội thoại
    displayDialogue('start');
}

// --- Hàm hiển thị hội thoại ---
function displayDialogue(dialogueId) {
    const dialogue = dialogueTree[dialogueId];
    if (!dialogue) return;

    // Reset lại khung hội thoại và các lựa chọn
    dialogueText.innerHTML = "";
    choiceContainer.innerHTML = "";
    
    // Bắt đầu hiệu ứng gõ chữ
    typeText(dialogue.text, () => {
        // Sau khi gõ xong, hiển thị các nút lựa chọn
        displayChoices(dialogue.choices);
    });
}

// --- Hàm tạo hiệu ứng gõ chữ ---
function typeText(text, callback) {
    isTyping = true;
    let index = 0;
    
    typeInterval = setInterval(() => {
        if (index < text.length) {
            dialogueText.innerHTML += text.charAt(index);
            // Phát âm thanh cho mỗi ký tự, đặt lại currentTime để phát lại ngay lập tức
            if (blipSound.readyState >= 2) {
                blipSound.currentTime = 0;
                blipSound.play().catch(error => { /* Bỏ qua lỗi play */ }); 
            }
            index++;
        } else {
            // Đã gõ xong
            clearInterval(typeInterval);
            isTyping = false;
            callback(); // Gọi hàm tiếp theo (hiển thị lựa chọn)
        }
    }, 50); // Khoảng cách thời gian giữa mỗi ký tự (ms)
}

// --- Hàm hiển thị các nút lựa chọn ---
function displayChoices(choices) {
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.innerText = choice.text;
        button.classList.add('choice-button');
        
        // Gắn sự kiện click dựa trên loại lựa chọn
        if (choice.nextId === "redirect_lời_chúc") {
            // Chuyển sang giao diện khác
            button.addEventListener('click', () => {
                window.location.href = "duong_dan_den_trang_loi_chuc.html"; // THAY ĐỔI ĐƯỜNG DẪN NÀY
            });
        } else if (choice.action === "runAway") {
            // Xử lý nút "Bỏ qua" chạy trốn
            runAwayButton = button;
            // Di chuyển nút lần đầu tiên ngay khi nó hiện ra
            moveRunAwayButton();
            // Gắn sự kiện di chuột qua để nó di chuyển
            runAwayButton.addEventListener('mouseover', moveRunAwayButton);
            // Gắn sự kiện click (mặc dù khó nhấp trúng) để có thể thoát hoặc hiện thông điệp
            runAwayButton.addEventListener('click', () => {
                alert("Ồ! Em bấm kịp cơ à. Nhưng mà, không 'Bỏ qua' đâu em");
            });
        }
        
        choiceContainer.appendChild(button);
    });
}

// --- Hàm làm nút "Bỏ qua" chạy trốn ---
function moveRunAwayButton() {
    if (!runAwayButton) return;

    // Lấy kích thước của container game và nút
    const containerRect = gameContainer.getBoundingClientRect();
    const buttonRect = runAwayButton.getBoundingClientRect();

    // Tính toán giới hạn vị trí
    const maxX = containerRect.width - buttonRect.width - 20; // Trừ padding
    const maxY = containerRect.height - buttonRect.height - 20; // Trừ padding

    // Tạo vị trí ngẫu nhiên mới
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    // Cập nhật vị trí của nút
    runAwayButton.style.position = 'absolute';
    runAwayButton.style.left = `${newX}px`;
    runAwayButton.style.top = `${newY}px`;
}

// --- Bắt đầu tất cả ---
// Thêm sự kiện click vào trang để người dùng bắt đầu hội thoại
// (Yêu cầu click để cho phép phát âm thanh tự động)
document.body.addEventListener('click', function startOnFirstClick() {
    document.body.removeEventListener('click', startOnFirstClick);
    startDialogue();
});