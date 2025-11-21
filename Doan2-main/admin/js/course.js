// ======================= LẤY CÁC ELEMENT =======================
const courseTableBody = document.getElementById("courseTableBody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");

// Modal (dùng lại modal bạn đặt tên là addUserModal)
const modal = document.getElementById("editCourseModal");
const saveBtn = document.getElementById("saveCourseBtn");
const closeBtn = document.getElementById("closeModalBtn");

// Input trong modal
const nameInput = document.getElementById("nameInput");
const descInput = document.getElementById("descInput");
const roleInput = document.getElementById("roleInput");
const teacherInput = document.getElementById("teacherInput");

// Biến lưu ID khóa học đang sửa
let editingCourseId = null;

// ======================= DỮ LIỆU GIẢ =======================
let courses = [
  {
    id: 1,
    namecourse: "T750+",
    desc: "Khóa học TOEIC 750+",
    role: "toeic",
    teacher: "Nguyễn Minh",
  },
  {
    id: 2,
    namecourse: "IELTS Master 8.0+",
    desc: "Chiến lược đạt band 8.0+",
    role: "ielts",
    teacher: "Trần Anh",
  },
  {
    id: 3,
    namecourse: "TOEIC Foundation",
    desc: "Dành cho người mới bắt đầu",
    role: "toeic",
    teacher: "Lê Hằng",
  },
  {
    id: 4,
    namecourse: "IELTS Writing Expert",
    desc: "Task 2 đạt 7.0+",
    role: "ielts",
    teacher: "Phạm Linh",
  },
  {
    id: 5,
    namecourse: "TOEIC 900+",
    desc: "Luyện đề chuyên sâu",
    role: "toeic",
    teacher: "Hoàng Nam",
  },
];

// ======================= HIỂN THỊ BẢNG =======================
function displayCourses(list) {
  courseTableBody.innerHTML = "";

  if (list.length === 0) {
    courseTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; padding:60px 20px; color:#95a5a6; font-size:15px;">
          <i class="fas fa-search fa-3x" style="margin-bottom:16px; display:block;"></i>
          Không tìm thấy khóa học nào
        </td>
      </tr>
    `;
    return;
  }

  list.forEach((course) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${course.id}</td>
      <td><strong>${course.namecourse}</strong></td>
      <td>${course.desc}</td>
      <td>
        <span class="badge ${course.role}">
          ${course.role.toUpperCase()}
        </span>
      </td>
      <td>${course.teacher}</td>
      <td class="actions">
        <button class="edit-btn" onclick="openEditModal(${
          course.id
        })" title="Sửa">
          <i class="fas fa-pen"></i>
        </button>
        <button class="delete-btn" onclick="deleteCourse(${
          course.id
        })" title="Xóa">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    courseTableBody.appendChild(tr);
  });
}

// ======================= TÌM KIẾM + LỌC =======================
function filterCourses() {
  const query = searchInput.value.toLowerCase().trim();
  const category = roleFilter.value; // all, ielts, toeic

  const filtered = courses.filter((c) => {
    const matchesSearch =
      c.namecourse.toLowerCase().includes(query) ||
      c.desc.toLowerCase().includes(query) ||
      c.teacher.toLowerCase().includes(query);

    const matchesCategory = category === "all" || c.role === category;

    return matchesSearch && matchesCategory;
  });

  displayCourses(filtered);
}

// ======================= MỞ MODAL SỬA =======================
function openEditModal(id) {
  const course = courses.find((c) => c.id === id);
  if (!course) return;

  editingCourseId = id;

  // Đưa dữ liệu vào form
  nameInput.value = course.namecourse;
  descInput.value = course.desc;
  roleInput.value = course.role;
  teacherInput.value = course.teacher;

  // Hiện modal
  modal.classList.add("show"); // hoặc dùng style.display = 'flex' nếu bạn dùng display
}

// ======================= LƯU THAY ĐỔI =======================
saveBtn.onclick = function () {
  if (!editingCourseId) return;

  const updatedCourse = {
    id: editingCourseId,
    namecourse: nameInput.value.trim(),
    desc: descInput.value.trim(),
    role: roleInput.value,
    teacher: teacherInput.value.trim(),
  };

  if (!updatedCourse.namecourse || !updatedCourse.teacher) {
    alert("Vui lòng nhập đầy đủ tên khóa học và giảng viên!");
    return;
  }

  // Cập nhật trong mảng
  const index = courses.findIndex((c) => c.id === editingCourseId);
  if (index !== -1) {
    courses[index] = updatedCourse;
  }

  alert("Cập nhật khóa học thành công!");

  // Đóng modal + cập nhật bảng
  modal.classList.remove("show");
  filterCourses();
};

// ======================= XÓA KHÓA HỌC =======================
function deleteCourse(id) {
  if (confirm("Bạn có chắc chắn muốn xóa khóa học này không?")) {
    courses = courses.filter((c) => c.id !== id);
    filterCourses();
  }
}

// ======================= ĐÓNG MODAL =======================
closeBtn.onclick = function () {
  modal.classList.remove("show");
  editingCourseId = null;
};

// Đóng khi click ngoài modal
window.onclick = function (e) {
  if (e.target === modal) {
    modal.classList.remove("active");
    editingCourseId = null;
  }
};

// ======================= SỰ KIỆN =======================
searchInput.addEventListener("input", filterCourses);
roleFilter.addEventListener("change", filterCourses);

// ======================= KHỞI TẠO =======================
displayCourses(courses);
