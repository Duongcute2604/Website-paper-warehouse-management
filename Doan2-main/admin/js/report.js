// report.js (CẬP NHẬT) -------------------------
/*
  Tính năng:
  - renderContent(type, from, to)
  - lock(username) / unlock(username) cập nhật data.violations và render lại
  - lọc theo ngày (from, to) cho users và revenue
  - vẽ biểu đồ doanh thu trên canvas động
*/

const data = {
  users: {
    summary: {
      totalUsers: 1254,
      students: 1100,
      teachers: 154,
      newRegistrations: 32,
    },
    table: [
      { id: 1, name: "Nguyễn Văn A", role: "Học viên", joinDate: "2025-10-01" },
      { id: 2, name: "Trần Thị B", role: "Giảng viên", joinDate: "2025-09-12" },
      { id: 3, name: "Lê C", role: "Học viên", joinDate: "2025-09-20" },
    ],
  },

  courses: {
    summary: {
      totalCourses: 36,
      activeCourses: 29,
      completedCourses: 7,
      totalRevenue: "56,200,000đ",
    },
    table: [
      {
        id: 1,
        name: "IELTS Writing Advanced",
        teacher: "Nguyễn Văn A",
        students: 320,
        percent: "85%",
        revenue: "12,000,000đ",
      },
      {
        id: 2,
        name: "TOEIC Listening 600+",
        teacher: "Trần Thị B",
        students: 280,
        percent: "78%",
        revenue: "10,500,000đ",
      },
      {
        id: 3,
        name: "English for Beginners",
        teacher: "Lê Bình",
        students: 250,
        percent: "91%",
        revenue: "9,200,000đ",
      },
    ],
  },

  revenue: {
    summary: {
      totalMonth: "56,200,000đ",
      totalYear: "620,000,000đ",
      avgPerStudent: "505,000đ",
      transactions: 324,
    },
    // mặc định chart (triệu đồng)
    chart: [42, 48, 53, 61, 68, 74, 80, 77, 65, 72, 79, 85],
    table: [
      {
        id: "TX001",
        student: "Nguyễn Văn A",
        course: "IELTS",
        amount: "1,500,000đ",
        method: "Chuyển khoản",
        date: "2025-10-10",
        status: "Đã thanh toán",
      },
      {
        id: "TX002",
        student: "Trần Thị B",
        course: "TOEIC",
        amount: "1,200,000đ",
        method: "Momo",
        date: "2025-10-09",
        status: "Đã thanh toán",
      },
      {
        id: "TX003",
        student: "Phạm Văn C",
        course: "Giao tiếp",
        amount: "900,000đ",
        method: "Thẻ",
        date: "2025-10-08",
        status: "Thất bại",
      },
    ],
  },

  violations: {
    reports: [
      {
        id: 1,
        username: "user123",
        reason: "Spam trong khóa học",
        status: "Đang bị khóa",
      },
      {
        id: 2,
        username: "teacherX",
        reason: "Nội dung không phù hợp",
        status: "Đang bị khóa",
      },
      {
        id: 3,
        username: "learnerZ",
        reason: "Báo cáo sai phạm",
        status: "Đã gỡ khóa",
      },
    ],
  },
};

// --- DOM references (dựa trên HTML bạn đang dùng)
const selectType = document.querySelector("select");
const statsContainer = document.querySelector(".stats");
const reportTableContainer = document.querySelector(".reportTable");
const exportDiv = document.querySelector(".export");

// LẤY ID THEO ACTION
const dateInputs = document.querySelectorAll(".actions input[type='date']");
const fromDateInput = dateInputs[0] || null;
const toDateInput = dateInputs[1] || null;
const applyButton = document.querySelector(".actions button");

// helper: parse yyyy-mm-dd to Date (local)
function parseDateYMD(s) {
  if (!s) return null;
  const parts = s.split("-");
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

// helper: parse money string like "1,500,000đ" -> number (VND)
function parseVND(str) {
  if (!str) return 0;
  return Number(str.replace(/[^\d]/g, "")) || 0;
}

// === renderContent accepts optional date filter (from/to as yyyy-mm-dd strings)
function renderContent(type, from = null, to = null) {
  statsContainer.innerHTML = "";
  reportTableContainer.innerHTML = "";
  exportDiv.innerHTML = "";

  if (type === "Người dùng") {
    renderUserStats(from, to);
  } else if (type === "Khóa học") {
    renderCourseStats(from, to);
  } else if (type === "Doanh thu") {
    renderRevenueStats(from, to);
  } else if (type === "" || type === "Tài khoản vi phạm") {
    renderViolationStats();
  } else {
    // nếu option value khác (trường hợp bạn đổi value) hỗ trợ các variant:
    if (
      type.toLowerCase().includes("user") ||
      type.toLowerCase().includes("người")
    )
      renderUserStats(from, to);
    else if (
      type.toLowerCase().includes("course") ||
      type.toLowerCase().includes("khóa")
    )
      renderCourseStats(from, to);
    else if (type.toLowerCase().includes("doanh")) renderRevenueStats(from, to);
    else renderViolationStats();
  }
}

// ================== USERS ==================
function renderUserStats(from, to) {
  const s = data.users.summary;
  // lọc bảng user theo ngày nếu from/to hợp lệ
  let rows = data.users.table.slice();
  if (from && to) {
    const f = parseDateYMD(from);
    const t = parseDateYMD(to);
    rows = rows.filter((u) => {
      const d = parseDateYMD(u.joinDate);
      return d >= f && d <= t;
    });
  }

  statsContainer.innerHTML = `
    <div class="card"><h3>Tổng người dùng</h3><p>${s.totalUsers}</p></div>
    <div class="card"><h3>Tổng học viên</h3><p>${s.students}</p></div>
    <div class="card"><h3>Tổng giảng viên</h3><p>${s.teachers}</p></div>
    <div class="card"><h3>Học viên đăng ký gần đây</h3><p>${s.newRegistrations}</p></div>
  `;

  reportTableContainer.innerHTML = `
    <h3>Bảng tổng hợp người dùng</h3>
    <table>
      <thead>
        <tr><th>STT</th><th>Họ tên</th><th>Vai trò</th><th>Ngày tham gia</th></tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (u) =>
              `<tr><td>${u.id}</td><td>${u.name}</td><td>${u.role}</td><td>${u.joinDate}</td></tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;

  exportDiv.innerHTML = `<button onclick="exportToPDF()">📄 Xuất PDF</button>`;
}

// ================== KHÓA HỌC ==================
function renderCourseStats(from, to) {
  const s = data.courses.summary;
  statsContainer.innerHTML = `
    <div class="card"><h3>Tổng khóa học</h3><p>${s.totalCourses}</p></div>
    <div class="card"><h3>Đang hoạt động</h3><p>${s.activeCourses}</p></div>
    <div class="card"><h3>Đã hoàn thành</h3><p>${s.completedCourses}</p></div>
    <div class="card"><h3>Doanh thu</h3><p>${s.totalRevenue}</p></div>
  `;

  reportTableContainer.innerHTML = `
    <h3>Bảng tổng hợp khóa học</h3>
    <table>
      <thead>
        <tr><th>STT</th><th>Tên khóa học</th><th>Giảng viên</th><th>Học viên</th><th>Hoàn thành (%)</th><th>Doanh thu</th></tr>
      </thead>
      <tbody>
        ${data.courses.table
          .map(
            (c) =>
              `<tr><td>${c.id}</td><td>${c.name}</td><td>${c.teacher}</td><td>${c.students}</td><td>${c.percent}</td><td>${c.revenue}</td></tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;

  exportDiv.innerHTML = `<button onclick="exportToPDF()">📄 Xuất PDF</button>`;
}

// ================== DOANH THU ==================
function renderRevenueStats(from, to) {
  const s = data.revenue.summary;

  statsContainer.innerHTML = `
    <div class="card"><h3>Doanh thu tháng</h3><p>${s.totalMonth}</p></div>
    <div class="card"><h3>Doanh thu năm</h3><p>${s.totalYear}</p></div>
    <div class="card"><h3>Trung bình / học viên</h3><p>${s.avgPerStudent}</p></div>
    <div class="card"><h3>Tổng giao dịch</h3><p>${s.transactions}</p></div>
  `;

  // chuẩn bị dữ liệu biểu đồ: nếu có from/to -> tổng hợp từ data.revenue.table, ngược lại dùng data.revenue.chart
  let chartValues = [];
  let transactions = data.revenue.table.slice();

  if (from && to) {
    const f = parseDateYMD(from);
    const t = parseDateYMD(to);
    transactions = transactions.filter((r) => {
      const d = parseDateYMD(r.date);
      return d && d >= f && d <= t;
    });

    // aggregate by month (1..12) -> value in triệu đồng
    const months = Array(12).fill(0);
    transactions.forEach((r) => {
      const d = parseDateYMD(r.date);
      if (!d) return;
      const m = d.getMonth(); // 0..11
      const v = parseVND(r.amount) / 1000000; // convert to million
      months[m] += v;
    });
    // round
    chartValues = months.map((v) => Math.round(v));
  } else {
    chartValues = data.revenue.chart.slice(); // triệu đồng
  }

  // Thêm biểu đồ
  reportTableContainer.innerHTML = `
  <div class="chart-container">
    <h3>Biểu đồ doanh thu theo tháng</h3>
    <div class="char-container"></div>
  </div>
`;

  // Lấy thẻ div nơi cần thêm
  const chartDiv = document.querySelector(".char-container");

  // Tạo thẻ <script>
  const script = document.createElement("script");
  // expose the prepared chart values so the chart script can read them
  window.reportChartValues = chartValues;
  // optional labels for months
  window.reportChartLabels = chartValues.map((_, i) => `Tháng ${i + 1}`);

  script.src = "./assets/js/char.js"; // đường dẫn tới file JS của bạn
  script.defer = true; // để script chạy sau khi HTML được load xong (không bắt buộc)

  // Thêm thẻ script vào trong div
  chartDiv.appendChild(script);

  // show transactions table (filtered if from/to)
  reportTableContainer.innerHTML += `
    <h3>Bảng giao dịch chi tiết</h3>
    <table>
      <thead>
        <tr><th>Mã GD</th><th>Học viên</th><th>Khóa học</th><th>Số tiền</th><th>Phương thức</th><th>Ngày</th><th>Trạng thái</th></tr>
      </thead>
      <tbody>
        ${transactions
          .map(
            (r) =>
              `<tr><td>${r.id}</td><td>${r.student}</td><td>${r.course}</td><td>${r.amount}</td><td>${r.method}</td><td>${r.date}</td><td>${r.status}</td></tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;

  exportDiv.innerHTML = `<button onclick="exportToPDF()">📄 Xuất PDF</button>`;
}

// ================== TÀI KHOẢN VI PHẠM ==================
function renderViolationStats() {
  reportTableContainer.innerHTML = `
    <h3>Danh sách tài khoản vi phạm</h3>
    <table>
      <thead>
        <tr><th>STT</th><th>Tài khoản</th><th>Lý do</th><th>Trạng thái</th><th>Hành động</th></tr>
      </thead>
      <tbody>
        ${data.violations.reports
          .map(
            (v) => `
          <tr>
            <td>${v.id}</td>
            <td>${v.username}</td>
            <td>${v.reason}</td>
            <td id="status-${v.username}">${v.status}</td>
            <td>
              ${
                v.status === "Đang bị khóa"
                  ? `<button onclick="unlock('${v.username}')">Gỡ khóa</button>`
                  : `<button onclick="lock('${v.username}')">Khóa</button>`
              }
            </td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
  `;

  statsContainer.innerHTML = `
    <div class="card"><h3>Tài khoản bị khóa</h3><p>${
      data.violations.reports.filter((r) => r.status === "Đang bị khóa").length
    }</p></div>
    <div class="card"><h3>Tổng báo cáo</h3><p>${
      data.violations.reports.length
    }</p></div>
  `;

  exportDiv.innerHTML = `<button onclick="exportToPDF()">📄 Xuất PDF</button>`;
}

// ================== KHÓA / GỠ KHÓA ==================
function lock(username) {
  const u = data.violations.reports.find((r) => r.username === username);
  if (u) u.status = "Đang bị khóa";
  renderViolationStats();
  alert(`🔒 Đã khóa tài khoản: ${username}`);
}
function unlock(username) {
  const u = data.violations.reports.find((r) => r.username === username);
  if (u) u.status = "Đã gỡ khóa";
  renderViolationStats();
  alert(`✅ Đã gỡ khóa tài khoản: ${username}`);
}

// ================== EXPORT ==================
function exportToPDF() {
  // Wait until the chart renderer has created DOM nodes in `.char-container`.
  // If not present yet, poll for a short time then print. This prevents
  // printing before the dynamic chart is inserted.
  const chartContainer = document.querySelector('.char-container');
  const readyToPrint = () => {
    // small timeout to ensure CSS has applied
    setTimeout(() => window.print(), 120);
  };

  if (!chartContainer) {
    // no chart area on page - print immediately
    readyToPrint();
    return;
  }

  const maxWait = 3000; // ms
  const interval = 100; // ms
  let waited = 0;
  const id = setInterval(() => {
    // consider ready when chartContainer has child nodes (rendered)
    if (chartContainer.children.length > 0 || waited >= maxWait) {
      clearInterval(id);
      readyToPrint();
    }
    waited += interval;
  }, interval);
}

// ================== SỰ KIỆN UI ==================
selectType.addEventListener("change", () => {
  // lấy giá trị option text (giữ tương thích với HTML bạn dùng)
  const selectedText = selectType.options[selectType.selectedIndex].text;
  renderContent(
    selectedText,
    fromDateInput ? fromDateInput.value : null,
    toDateInput ? toDateInput.value : null
  );
});

if (applyButton) {
  applyButton.addEventListener("click", () => {
    const selectedText = selectType.options[selectType.selectedIndex].text;
    const from = fromDateInput ? fromDateInput.value : null;
    const to = toDateInput ? toDateInput.value : null;
    if ((from && !to) || (!from && to)) {
      alert(
        "Vui lòng chọn cả Từ ngày và Đến ngày hoặc bỏ cả hai để xem toàn bộ."
      );
      return;
    }
    if (from && to && parseDateYMD(from) > parseDateYMD(to)) {
      alert("Từ ngày không được lớn hơn Đến ngày.");
      return;
    }
    renderContent(selectedText, from, to);
  });
}

// mặc định render Người dùng
renderContent("Người dùng");
