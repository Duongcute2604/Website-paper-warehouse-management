// manage_homework.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("manage_homework.js loaded");
  loadAssignments();
  setupTabs();
  updateTabCounts();
});

let allAssignments = []; // Lưu tạm để tính tab

function loadAssignments(filter = "all") {
  console.log("loadAssignments called with filter:", filter);
  const grid = document.querySelector(".assignment-grid");
  if (!grid) return;

  grid.innerHTML = ""; // Xóa cũ

  allAssignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  const filtered = allAssignments.filter((a) => {
    if (filter === "published") return a.status === "published";
    if (filter === "draft") return a.status === "draft";
    return true;
  });

  if (filtered.length === 0) {
    grid.style.display = "block";
    grid.innerHTML = `
      <div style="
        background: white; padding: 2rem; border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1); text-align: center; color: var(--grey);
      ">
        <i class="fas fa-clipboard-list" style="font-size: 2.5rem; color: var(--white); margin-bottom: 0.5rem;"></i>
        <p>Chưa có bài tập nào. Nhấn "Tạo bài tập mới" để bắt đầu!</p>
      </div>`;
    return;
  }

  grid.style.display = "grid";

  filtered.forEach((a) => {
    const card = createAssignmentCard(a);
    grid.appendChild(card);
  });
}

function createAssignmentCard(a) {
  const card = document.createElement("div");
  card.className = "assignment-card";

  // === THAY ĐOẠN NÀY TRONG manage_homework.js ===
  if (a.status === "published") {
    // --- DỮ LIỆU GIẢ LẬP: SẼ ĐƯỢC THAY BẰNG DỮ LIỆU THỰC TẾ SAU ---
    const submitted = 0; // <-- Số học viên đã nộp
    const notSubmitted = 0; // <-- Số học viên chưa nộp
    const total = submitted + notSubmitted;
    const percent = total > 0 ? Math.round((submitted / total) * 100) : 0;

    card.innerHTML = `
    <div class="assignment-card-header">
      <div class="assignment">
        <h3 class="assignment-title">${escapeHtml(a.title)}</h3>
        <span class="badge badge-published">Đã xuất bản</span>
      </div>
      <div class="assignment-meta">
        <span><i class="fas fa-book"></i> ${escapeHtml(a.course)}</span>
        <span><i class="fas fa-calendar"></i> Hạn: ${formatDeadline(
          a.deadline
        )}</span>
      </div>
    </div>
    <div class="assignment-body">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value done">${submitted}</div>
          <div class="stat-label">Đã nộp</div>
        </div>
        <div class="stat-item">
          <div class="stat-value done-yet">${notSubmitted}</div>
          <div class="stat-label">Chưa nộp</div>
        </div>
      </div>
      <div class="progress-container">
        <div class="progress-label">
          <span>Tỷ lệ nộp</span>
          <span>${percent}%</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${percent}%"></div>
        </div>
      </div>
      <div class="assignment-actions">
        <button class="btn btn-primary btn-sm" onclick="viewDetail('${
          a.id
        }')">Xem chi tiết</button>
        <button class="btn btn-outline btn-sm" onclick="editDraft('${
          a.id
        }')">Chỉnh sửa</button>
        <button class="btn btn-outline btn-sm text-red" onclick="deleteAssignment('${
          a.id
        }')">Xóa</button>
      </div>
    </div>
  `;
  } else {
    // Bản nháp
    card.innerHTML = `
      <div class="assignment-card-header">
        <div class="assignment">
          <h3 class="assignment-title">${escapeHtml(a.title)}</h3>
          <span class="badge badge-draft">Bản nháp</span>
        </div>
        <div class="assignment-meta">
          <span><i class="fas fa-book"></i> ${escapeHtml(a.course)}</span>
          <span><i class="fas fa-calendar"></i> Chưa đặt hạn</span>
        </div>
      </div>
      <div class="assignment-body">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">—</div>
            <div class="stat-label">Chưa xuất bản</div>
          </div>
        </div>
        <div class="assignment-actions">
          <button class="btn btn-outline btn-sm" onclick="editDraft('${
            a.id
          }')">Tiếp tục soạn</button>
          <button class="btn btn-outline btn-sm text-red" onclick="deleteAssignment('${
            a.id
          }')">Xóa</button>
        </div>
      </div>
    `;
  }

  return card;
}

function formatDeadline(d) {
  if (!d) return "Chưa đặt hạn";
  const date = new Date(d);
  if (isNaN(date)) return "Không hợp lệ";
  return date.toLocaleDateString("vi-VN");
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Tab
function setupTabs() {
  const tabs = document.querySelectorAll(".filter-tabs .tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const text = tab.textContent || tab.innerText;
      if (text.includes("Tất cả")) loadAssignments("all");
      else if (text.includes("Đã xuất bản")) loadAssignments("published");
      else if (text.includes("Bản nháp")) loadAssignments("draft");
    });
  });
}

function updateTabCounts() {
  const published = allAssignments.filter(
    (a) => a.status === "published"
  ).length;
  const draft = allAssignments.filter((a) => a.status === "draft").length;
  const total = allAssignments.length;

  const tabs = document.querySelectorAll(".filter-tabs .tab");
  tabs[0].textContent = `Tất cả (${total})`;
  tabs[1].textContent = `Đã xuất bản (${published})`;
  tabs[2].textContent = `Bản nháp (${draft})`;
}

// Xóa
function deleteAssignment(id) {
  if (!confirm("Bạn có chắc muốn xóa bài tập này?")) return;

  let assignments = JSON.parse(localStorage.getItem("assignments") || "[]");
  assignments = assignments.filter((a) => a.id !== id);
  localStorage.setItem("assignments", JSON.stringify(assignments));

  allAssignments = assignments;
  updateTabCounts();
  loadAssignments(getActiveFilter());
}

function getActiveFilter() {
  const active = document.querySelector(".filter-tabs .tab.active");
  const text = active?.textContent || "";
  if (text.includes("Tất cả")) return "all";
  if (text.includes("Đã xuất bản")) return "published";
  return "draft";
}

function editDraft(id) {
  localStorage.setItem("editingAssignmentId", id);
  window.location.href = "create-homework.html";
}

function viewDetail(id) {
  localStorage.setItem("detailAssignmentId", id);
  window.location.href = "./detail-homework.html";
}

// === THÊM VÀO CUỐI manage_homework.js ===
document
  .getElementById("create-new-homework")
  ?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("editingAssignmentId"); // XÓA ID CŨ
    window.location.href = "./create-homework.html";
  });
