// Kiểm tra người dùng tồn tại
currentUser = localStorage.getItem("currentUser");
window.addEventListener("DOMContentLoaded", () => {
    let currentUser = localStorage.getItem("currentUser");
    if (currentUser && listusers[currentUser]) {
      window.location.href = "index.html";
    }
  });

// Hàm hiển thị form
function showForm(formClass) {
  document.querySelectorAll(".Auth > div").forEach((div) => {
    div.classList.remove("active");
  });
  document.querySelector(`.${formClass}`).classList.add("active");
}
//đăng nhập mặc định sẽ hiển thị
showForm("Auth-Login");

// Gắn sự kiện click
document.querySelector(".Auth-Login span:nth-of-type(1)").onclick = () =>
  showForm("Forgot-password");

document.querySelector(".Auth-Login span:nth-of-type(2)").onclick = () =>
  showForm("Auth-Signup");

document.querySelector(".Auth-Signup span").onclick = () =>
  showForm("Auth-Login");

document.querySelector(".Forgot-password span").onclick = () =>
  showForm("Auth-Login");

// Regex kiểm tra dữ liệu
const usernameRegex = /^[a-zA-Z0-9]{4,12}$/; // Chỉ cho phép chữ cái và số, độ dài từ 4–12 ký tự
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Mật khẩu ít nhất 8 ký tự, có chữ và số
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Định dạng email chuẩn
const phoneRegex =
  /^(0|\+84)(3[2-9]|5[6|8|9]|7[0|6-9]|8[1-5]|9[0-4|6-9])[0-9]{7}$/; // Số điện thoại Việt Nam

// Hàm đăng ký
function registerUser() {
  let yourname = document.getElementById("signup-yourname").value.trim();
  let username = document.getElementById("signup-username").value.trim();
  let email = document.getElementById("signup-email").value.trim();
  let phone = "";
  let password = document.getElementById("signup-password").value.trim();
  let confirmPassword = document
    .getElementById("signup-password-confirm")
    .value.trim();
  let role = "Học viên";
  let bob = "";
  let province = "";
  let district = "";

  // Kiểm tra định dạng
  if (!usernameRegex.test(username)) {
    alert("Tên tài khoản không hợp lệ. Vui lòng sử dụng 4-12 ký tự chữ và số.");
    return;
  }
  if (!passwordRegex.test(password)) {
    alert(
      "Mật khẩu không hợp lệ. Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và số."
    );
    return;
  }
  if (password !== confirmPassword) {
    alert("Mật khẩu xác nhận không khớp.");
    return;
  }
  if (!emailRegex.test(email)) {
    alert("Địa chỉ email không hợp lệ.");
    return;
  }

  // Lấy danh sách người dùng đã lưu
  let listusers = JSON.parse(localStorage.getItem("listusers")) || {};

  // Kiểm tra trùng username, email, phone
  if (listusers[username]) {
    alert("Tên tài khoản đã tồn tại. Vui lòng chọn tên khác.");
    return;
  }
  for (let key in listusers) {
    if (listusers[key].email === email) {
      alert("Email đã được sử dụng. Vui lòng sử dụng email khác.");
      return;
    }
  }
  // Nếu mọi thứ hợp lệ, tiến hành lưu
  listusers[username] = {
    yourname: yourname,
    email: email,
    phone: phone,
    bob: bob,
    password: password,
    province: province,
    district: district,
    role: role,
  };

  localStorage.setItem("listusers", JSON.stringify(listusers));
  alert("Đăng ký thành công!");
  showForm("Auth-Login");
}
document.getElementById("signup-button").onclick = registerUser;


// Hàm đăng nhập
function loginUser() {
  //lấy thông tin người dùng từ localstorage
  let listusers = JSON.parse(localStorage.getItem("listusers")) || {};
  let username = document.getElementById("login-username").value;
  let password = document.getElementById("login-password").value;

  // hàm test đăng nhập giao diện giảng viên (có thể xóa )
  if (username === "Kurumi12" && password === "Kurumi12") {
    localStorage.setItem("currentUser", username);
    window.location.href = "../../Teacher/teacher.html";
    return;
  }

  // đây là hàm của m code đăng nhập cho học viên
  for (let key in listusers) {
    if (key === username && listusers[key].password === password) {
      alert("Đăng nhập thành công!");
      localStorage.setItem("currentUser", username);
      window.location.href = "../../index.html"; // Chuyển hướng đến trang chủ
      return;
    }
  }

  alert("Tên tài khoản hoặc mật khẩu không đúng.");
}
// Lưu thông tin người dùng hiện tại
const checkbox = document.getElementById("checkbox");
checkbox.addEventListener("change", function () {
  if (this.checked) {
    localStorage.setItem("currentUser", username);
    let currentUser = localStorage.getItem("currentUser");
    document.getElementById("login-button").onclick = loginUser;
  }
});


// Hàm đặt lại mật khẩu
function resetPassword() {
  let listusers = JSON.parse(localStorage.getItem("listusers")) || {};
  let email = document.getElementById("forgot-email").value;

  for (let key in listusers) {
    if (listusers[key].email === email) {
      alert("Mật khẩu của bạn là: " + listusers[key].password);
      return;
    }
  }
  alert("Email không tồn tại trong hệ thống.");
}
document.getElementById("forgot-button").onclick = resetPassword;
