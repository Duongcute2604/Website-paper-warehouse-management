let listusers = JSON.parse(localStorage.getItem("listusers")) || {};
let username = localStorage.getItem("currentUser");

// khai báo biến để lấy thông tin người dùng hiện tại
let inputYourname = document.querySelector(".input-yourname");
let inputUsername = document.querySelector(".input-username");
let inputEmail = document.querySelector(".input-email");
let inputPhone = document.querySelector(".input-phone");
let inputBob = document.querySelector(".input-bob");
let inputProvince = document.querySelector(".input-province");
let inputDistrict = document.querySelector(".input-district");

// Lấy tên người dùng hiện tại từ localStorage
if (username && listusers[username]) {
    let currentUserInfo = listusers[username];
    inputYourname.textContent = currentUserInfo.yourname;
    inputUsername.textContent = username;
    inputEmail.textContent = currentUserInfo.email;
    inputPhone.textContent = currentUserInfo.phone;
    inputBob.textContent = currentUserInfo.bob;
    inputProvince.textContent = currentUserInfo.province;
    inputDistrict.textContent = currentUserInfo.district;
} else {
    console.error("Người dùng hiện tại không tồn tại trong danh sách người dùng.");
}
