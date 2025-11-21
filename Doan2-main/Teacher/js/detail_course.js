// ========================== LOAD COURSE ==========================
let courses = JSON.parse(localStorage.getItem("courses")) || [];
const courseId = localStorage.getItem("selectedCourseId");
const nameTeacher = localStorage.getItem("savedUsername");

const course = courses.find((c) => String(c.id) === String(courseId));

if (!course) {
  alert("Không tìm thấy khóa học!");
  window.location.href = "Teacher/manage-course.html";
}

// ========================== ELEMENTS ==========================
const titleInput = document.getElementById("course-title");
const typeSelect = document.getElementById("course-select");
const dateInput = document.getElementById("date-input");
const courseDetail = document.getElementById("course-detail");
const priceInput = document.getElementById("number-price");
const videoListEl = document.getElementById("video-list");
const nameInput = document.querySelector(".name-teacher");
const statusSelect = document.getElementById("course-status");
// ========================== HIỂN THỊ ==========================
nameInput.innerHTML = nameTeacher;
dateInput.value = course.date;
titleInput.value = course.name;
typeSelect.value = course.type;
statusSelect.value = course.status;
courseDetail.value = course.detail;
priceInput.value = course.price;

renderVideos();

// ========================== RENDER VIDEO ==========================
function renderVideos() {
  videoListEl.innerHTML = "";

  course.videos.forEach((video) => {
    const div = document.createElement("div");
    div.className = "video-item";

    div.innerHTML = `
      <p><strong>${video.title}</strong></p>
      <a href="${video.url}" target="_blank">${video.url}</a>
      <button class="delete-video">Xóa</button>
    `;

    // 👉 Click vào video-item để mở modal sửa video
    div.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-video")) return;

      openEditVideoModal(video);
    });

    // 👉 Nút xóa
    div.querySelector(".delete-video").onclick = (e) => {
      e.stopPropagation();
      course.videos = course.videos.filter((v) => v.id !== video.id);
      saveCourse();
      renderVideos();
    };

    videoListEl.appendChild(div);
  });
}

// ========================== ADD VIDEO ==========================
document.getElementById("add-video-btn").onclick = (e) => {
  e.preventDefault();
  document.getElementById("add-video-modal").style.display = "flex";
};

document.getElementById("cancel-video").onclick = () => {
  document.getElementById("add-video-modal").style.display = "none";
};

document.getElementById("add-video-form").onsubmit = function (e) {
  e.preventDefault();

  const title = document.getElementById("video-title").value;
  const url = document.getElementById("video-url").value;

  course.videos.push({
    id: Date.now(),
    title,
    url,
  });

  saveVideo();
  renderVideos();

  this.reset();
  document.getElementById("add-video-modal").style.display = "none";
};

// ========================== LƯU VIDEO VÀ CHỈNH SỬA VIDEO ==========================
document.getElementById("save-course").onclick = saveCourse;

function saveCourse() {
  course.name = titleInput.value;
  course.type = typeSelect.value;
  course.date = dateInput.value;
  course.price = priceInput.value;
  course.detail = courseDetail.value;
  course.status = statusSelect.value;
  const index = courses.findIndex((c) => c.id === course.id);
  courses[index] = course;

  localStorage.setItem("courses", JSON.stringify(courses));

  alert("Lưu thông tin thay đổi!");

  setTimeout(() => {
    window.location.href = "../Teacher/manage-course.html";
  }, 10);
}

function saveVideo() {
  course.name = titleInput.value;
  course.type = typeSelect.value;
  course.date = dateInput.value;
  course.price = priceInput.value;

  const index = courses.findIndex((c) => c.id === course.id);
  courses[index] = course;

  localStorage.setItem("courses", JSON.stringify(courses));

  alert("Lưu thông tin thay đổi!");
}

// ========================== HỦY ==========================
document.getElementById("cancel-course").onclick = () => {
  setTimeout(() => {
    window.location.href = "../Teacher/manage-course.html";
  }, 10);
};

// ========================== LÁY VIDEO ==========================

let currentEditingVideo = null;

function openEditVideoModal(video) {
  currentEditingVideo = video;

  document.getElementById("edit-video-title").value = video.title;
  document.getElementById("edit-video-url").value = video.url;

  document.getElementById("edit-video-modal").style.display = "flex";
}

document.getElementById("edit-video-form").onsubmit = function (e) {
  e.preventDefault();

  currentEditingVideo.title = document.getElementById("edit-video-title").value;
  currentEditingVideo.url = document.getElementById("edit-video-url").value;

  saveVideo();
  renderVideos();

  document.getElementById("edit-video-modal").style.display = "none";
};

document.getElementById("cancel-edit-video").onclick = () => {
  document.getElementById("edit-video-modal").style.display = "none";
};
