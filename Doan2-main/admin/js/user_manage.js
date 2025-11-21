const userTableBody = document.getElementById("userTableBody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");
const addUserBtn = document.getElementById("addUserBtn");
const addUserModal = document.getElementById("addUserModal");

//========================= ĐÂY LÀ DỮ LIỆU ĐỂ LƯU VÀO LOCAL  ======================= //
const nameInput = document.getElementById("nameInput");
const emailInput = document.getElementById("emailInput");
const roleInput = document.getElementById("roleInput");
const statusInput = document.getElementById("statusInput");
const saveUserBtn = document.getElementById("saveUserBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
let editingUserId = null;

const users = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@gmail.com",
    role: "teacher",
    created: "2024-10-01",
    status: "Hoạt động",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@gmail.com",
    role: "student",
    created: "2024-10-03",
    status: "Khóa",
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "c@gmail.com",
    role: "student",
    created: "2024-10-05",
    status: "Hoạt động",
  },
];

// Hàm hiển thị danh sách người dùng
function displayUsers(usersToDisplay) {
  userTableBody.innerHTML = "";
  usersToDisplay.forEach((user) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>${user.created}</td>
      <td>${user.status}</td>
      <td class="actions">
        <button class="edit" onclick="Edit(${user.id})">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="delete" onclick="Delete(${user.id})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;
    userTableBody.appendChild(row);
  });
}

// Hàm lọc người dùng theo tìm kiếm và vai trò
function filterUsers() {
  const searchText = searchInput.value.toLowerCase();
  const selectedRole = roleFilter.value;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchText) ||
      user.email.toLowerCase().includes(searchText);
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  displayUsers(filteredUsers);
}

// Hàm mở modal để thêm hoặc sửa người dùng
function openModal(user = null) {
  addUserModal.style.display = "flex";
  if (user) {
    // Chế độ chỉnh sửa
    editingUserId = user.id;
    nameInput.value = user.name;
    emailInput.value = user.email;
    roleInput.value = user.role;
    usernameInput.value = user.username;
    passwordInput.value = user.password;
    statusInput.value = user.status === "Online" ? "active" : "locked";
  } else {
    // Chế độ thêm mới
    editingUserId = null;
    nameInput.value = "";
    emailInput.value = "";
    roleInput.value = "teacher";
    usernameInput.value = "";
    passwordInput.value = "";
    statusInput.value = "active";
  }
}

// Hàm lưu người dùng
function saveUser() {
  const newUser = {
    id: editingUserId || users.length + 1,
    name: nameInput.value,
    email: emailInput.value,
    role: roleInput.value,
    username: usernameInput.value,
    password: passwordInput.value,
    createdDate: new Date().toLocaleDateString("vi-VN"),
    status: statusInput.value === "active" ? "Online" : "Offline",
  };

  if (!newUser.name || !newUser.email) {
    alert("Vui lòng nhập đầy đủ họ tên và email!");
    return;
  }

  if (editingUserId) {
    // Cập nhật người dùng hiện có
    const index = users.findIndex((user) => user.id === editingUserId);
    users[index] = newUser;
  } else {
    // Thêm người dùng mới
    users.push(newUser);
  }

  filterUsers();
  addUserModal.style.display = "none";
}

// Hàm chỉnh sửa người dùng
function Edit(id) {
  const user = users.find((user) => user.id === id);
  if (user) {
    openModal(user);
  }
}

// Hàm xóa người dùng
function Delete(id) {
  if (confirm("Bạn có chắc muốn xóa người dùng này?")) {
    const index = users.findIndex((user) => user.id === id);
    users.splice(index, 1);
    filterUsers();
  }
}

// Sự kiện tìm kiếm
searchInput.addEventListener("input", filterUsers);

// Sự kiện lọc theo vai trò
roleFilter.addEventListener("change", filterUsers);

// Sự kiện mở modal thêm người dùng
addUserBtn.addEventListener("click", () => openModal());

// Sự kiện lưu người dùng
saveUserBtn.addEventListener("click", saveUser);

// Sự kiện đóng modal
closeModalBtn.addEventListener("click", () => {
  addUserModal.style.display = "none";
});

// Hiển thị danh sách người dùng ban đầu
displayUsers(users);
