// ======================= LẤY ELEMENT =======================
const courseTableBody = document.getElementById("courseTableBody");
const searchInput = document.getElementById("searchInput");
const roleFilter = document.getElementById("roleFilter");

const modal = document.getElementById("editCourseModal");
const saveBtn = document.getElementById("saveCourseBtn");
const closeBtn = document.getElementById("closeModalBtn");
const addBtn = document.getElementById("addCourseBtn");

const nameInput = document.getElementById("nameInput");
const descInput = document.getElementById("descInput");
const roleInput = document.getElementById("roleInput");
const teacherInput = document.getElementById("teacherInput");

let editingCourseId = null;
let isAdding = false;


function openEditModal(course) {
  editingCourseId = course.courseID;
  // gán dữ liệu vào input...
}

document.getElementById("saveCourseBtn").addEventListener("click", () => {
  const course = {
    courseID: editingCourseId, // cần cho PUT
    name: document.getElementById("courseName").value,
    description: document.getElementById("courseDesc").value,
    category: document.getElementById("courseCategory").value,
    instructor: document.getElementById("courseInstructor").value,
    price: Number(document.getElementById("coursePrice").value)
  };

  if (editingCourseId) {
    updateCourse(course);
  } else {
    // bỏ courseID khi tạo mới nếu backend tự sinh
    const { courseID, ...createPayload } = course;
    createCourse(createPayload);
  }
});

function onClickDelete(id) {
  deleteCourse(id);
}



// ======================= GỌI API =======================
document.addEventListener("DOMContentLoaded", () => {
  fetchCourses();
});

const API_URL = "https://localhost:7097/api/Course";
let courses = [];

async function fetchCourses() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API lỗi: " + res.status);
    const data = await res.json();

    if (!Array.isArray(data)) {
      console.warn("Dữ liệu không phải mảng:", data);
      courseTableBody.innerHTML = `<tr><td colspan="6">Dữ liệu không hợp lệ</td></tr>`;
      return;
    }

    courses = data;
    displayCourses(courses);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách khóa học:", error);
    courseTableBody.innerHTML = `<tr><td colspan="6">Không thể tải danh sách khóa học</td></tr>`;
  }
}

async function createCourse(course) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Lỗi khi thêm:", errorText);
      alert("Thêm khóa học thất bại!");
      return;
    }

    alert("Thêm khóa học thành công!");
    fetchCourses();
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    alert("Lỗi kết nối khi thêm khóa học.");
  }
}

async function updateCourse(course) {
  if (!course.courseID) { alert("Thiếu courseID để cập nhật"); return; }
  try {
    const res = await fetch(`${API_URL}/${course.courseID}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(course),
    });
    if (!res.ok) {
      const err = await res.text();
      console.error("Update failed:", err);
      alert("Cập nhật khóa học thất bại!");
      return;
    }
    alert("Cập nhật thành công!");
    fetchCourses();
  } catch (e) {
    console.error(e);
    alert("Không thể kết nối API khi cập nhật.");
  }
}

async function deleteCourse(id) {
  if (!id) { alert("Thiếu ID để xóa"); return; }
  if (!confirm("Bạn có chắc muốn xóa khóa học này?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.text();
      console.error("Delete failed:", err);
      alert("Xóa khóa học thất bại!");
      return;
    }
    alert("Xóa thành công!");
    fetchCourses();
  } catch (e) {
    console.error(e);
    alert("Không thể kết nối API khi xóa.");
  }
}


// ======================= HIỂN THỊ BẢNG =======================
function displayCourses(list) {
  if (!Array.isArray(list)) {
    console.warn("Dữ liệu không hợp lệ:", list);
    return;
  }

  if (list.length === 0) {
    courseTableBody.innerHTML = `<tr><td colspan="6">Không có khóa học nào</td></tr>`;
    return;
  }

  // render bảng...



  const rows = list.map((course) => `
    <tr>
      <td>${course.courseID}</td>
      <td><strong>${course.courseName}</strong></td>
      <td>${course.courseDes}</td>
      <td><span class="badge ${course.courseType}">${course.courseType.toUpperCase()}</span></td>
      <td>${course.teacherName || course.teacherID}</td>
      <td class="actions">
        <button onclick="openEditModal(${course.courseID})"><i class="fas fa-pen"></i></button>
        <button onclick="deleteCourse(${course.courseID})"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  `);

  courseTableBody.innerHTML = rows.join("");
}
// ======================= TÌM KIẾM + LỌC =======================
function filterCourses() {
  const query = searchInput.value.toLowerCase().trim();
  const category = roleFilter.value;
if (!list || list.length === 0) {
  courseTableBody.innerHTML = `<tr><td colspan="6">Không có khóa học nào</td></tr>`;
}

  const filtered = courses.filter((c) => {
    const matchesSearch =
      c.courseName.toLowerCase().includes(query) ||
      c.courseDes.toLowerCase().includes(query) ||
      String(c.teacherID).toLowerCase().includes(query);

    const matchesCategory = category === "all" || c.courseType === category;

    return matchesSearch && matchesCategory;
  });

  displayCourses(filtered);
}

// ======================= MỞ MODAL SỬA =======================
function openEditModal(id) {
  const course = courses.find((c) => c.courseID === id);
  if (!course) return;

  isAdding = false;
  editingCourseId = id;

  nameInput.value = course.courseName;
  descInput.value = course.courseDes;
  roleInput.value = course.courseType;
  teacherInput.value = course.teacherID;

  modal.classList.add("show");
}

// ======================= MỞ MODAL THÊM =======================
addBtn.onclick = function () {
  isAdding = true;
  editingCourseId = null;

  nameInput.value = "";
  descInput.value = "";
  roleInput.value = "ielts";
  teacherInput.value = "";

  modal.classList.add("show");
};

// ======================= LƯU THAY ĐỔI / THÊM =======================
saveBtn.onclick = function () {
  const courseData = {
    teacherID: teacherInput.value.trim(),
    courseName: nameInput.value.trim(),
    courseType: roleInput.value,
    courseDes: descInput.value.trim(),
    courseSDate: new Date().toISOString().split("T")[0],
    courseEDate: new Date().toISOString().split("T")[0],
    coursePrice: 500000,
    courseStatus: "active",
    courseImage: "default.jpg",
  };

  if (!courseData.courseName || !courseData.teacherID) {
    alert("Vui lòng nhập đầy đủ tên khóa học và giảng viên!");
    return;
  }

  if (isAdding) {
    createCourse(courseData);
  } else {
    courseData.courseID = editingCourseId;
    updateCourse(courseData);
  }

  modal.classList.remove("show");
  isAdding = false;
  editingCourseId = null;
};

// ======================= ĐÓNG MODAL =======================
closeBtn.onclick = function () {
  modal.classList.remove("show");
  editingCourseId = null;
  isAdding = false;
};

window.onclick = function (e) {
  if (e.target === modal) {
    modal.classList.remove("show");
    editingCourseId = null;
    isAdding = false;
  }
};

// ======================= SỰ KIỆN =======================
searchInput.addEventListener("input", filterCourses);
roleFilter.addEventListener("change", filterCourses);

// ======================= KHỞI TẠO =======================


fetchCourses();
