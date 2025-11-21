let userInfo = JSON.parse(localStorage.getItem("userInfo"));
const userID = localStorage.getItem("detailAssignmentId");

if (userInfo) {
  document.getElementById("name").textContent = userInfo.name || "";
  document.getElementById("email").textContent = userInfo.email || "";
  document.getElementById("phone").textContent = userInfo.phone || "";
  document.getElementById("address").textContent = userInfo.address || "";
}

const btnOpenModal = document.getElementById("change-password-btn");
btnOpenModal.addEventListener("click", openChangePasswordModal);

function openChangePasswordModal() {
  document.getElementById("modal-change-password").classList.add("show");
}

// Đóng modal
function closeModal() {
  document.getElementById("modal-change-password").classList.remove("show");
}

// Click nền để đóng
document
  .getElementById("modal-change-password")
  .addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });

// Hiện/ẩn mật khẩu
function togglePass(icon) {
  const input = icon.previousElementSibling;
  if (input.type === "password") {
    input.type = "text";
    icon.classList.remove("fa-eye-slash");
    icon.classList.add("fa-eye");
  } else {
    input.type = "password";
    icon.classList.remove("fa-eye");
    icon.classList.add("fa-eye-slash");
  }
}
