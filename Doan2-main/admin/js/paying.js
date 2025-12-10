// Chạy sau khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  // ======================= KHAI BÁO BIẾN TOÀN CỤC =======================
  let payments = [];
  
  // ======================= LẤY PHẦN TỬ HTML =======================
  const paymentTableBody = document.getElementById("paymentTableBody");
  const searchPayment = document.getElementById("searchPayment");
  const roleFilter = document.getElementById("roleFilter");
  const roleFilterCourse = document.getElementById("roleFilterCourse");
  const dateFrom = document.getElementById("fromDate");
  const dateTo = document.getElementById("toDate");
  const applyDate = document.getElementById("applyDate");
  const paymentModal = document.getElementById("paymentModal");
  const payId = document.getElementById("payId");
  const payName = document.getElementById("payName");
  const payCourse = document.getElementById("payCourse");
  const payAmount = document.getElementById("payAmount");
  const payMethod = document.getElementById("payMethod");
  const payDate = document.getElementById("payDate");
  const payStatus = document.getElementById("payStatus");
  const Total = document.getElementById("Total");
  const totalTrade = document.getElementById("totalTrade");
  const tradeSuccsess = document.getElementById("tradeSuccsess");
  const tradeFail = document.getElementById("tradeFail");
  
  // ======================= API CALL =======================
  async function loadPayments() {
    try {
      const response = await fetch("https://localhost:7097/api/Revenue");
      if (!response.ok) throw new Error("Lỗi khi gọi API");
      payments = await response.json();
      
      displayPayment(payments);
      displayTotal(payments);
    } catch (error) {
      console.error("Error:", error);
      if (paymentTableBody) {
        paymentTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Không thể tải dữ liệu</td></tr>`;
      }
    }
  }
  
  // ======================= HIỂN THỊ TỔNG QUAN =======================
  function displayTotal(paymentList) {
    if (!paymentList || paymentList.length === 0) {
      Total.textContent = "0 đ";
      totalTrade.textContent = "0";
      tradeSuccsess.textContent = "0";
      tradeFail.textContent = "0";
      return;
    }
    
    let total = 0, trade = 0, succsess = 0, fail = 0;
    
    for (let i = 0; i < paymentList.length; i++) {
      const amount = Number(paymentList[i].amount) || 0;
      if (paymentList[i].status === "Đã thanh toán") {
        total += amount;
        succsess++;
      } else {
        fail++;
      }
      trade++;
    }
    
    if (Total) Total.textContent = total.toLocaleString("vi-VN") + " đ";
    if (totalTrade) totalTrade.textContent = trade;
    if (tradeSuccsess) tradeSuccsess.textContent = succsess;
    if (tradeFail) tradeFail.textContent = fail;
  }
  
  // ======================= HIỂN THỊ DỮ LIỆU =======================
  function displayPayment(list_payment) {
    if (!paymentTableBody) return;
    
    paymentTableBody.innerHTML = "";
    
    if (!list_payment || list_payment.length === 0) {
      paymentTableBody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Không có dữ liệu phù hợp</td></tr>`;
      return;
    }
    
    const rowsHTML = list_payment.map((p) => {
      // Kiểm tra xem có phải là revenueID hay id
      const paymentId = p.revenueID || p.id;
      
      return `
        <tr>
          <td>${paymentId}</td>
          <td>${p.studentName || p.student}</td>
          <td>${p.courseName || p.course}</td>
          <td>${p.amount ? p.amount.toLocaleString() : 0}đ</td>
          <td>${p.paymentMethod || p.method}</td>
          <td>${p.paymentDate || p.date}</td>
          <td>${p.status}</td>
          <td class="actionsTable">
            <button class="view-btn" onclick="viewPayment('${paymentId}')"><i class="fas fa-eye"></i></button>
            ${p.status === "Chờ xác nhận" ? `<button class="confirm-btn" onclick="confirmPayment('${paymentId}')"><i class="fas fa-check-circle"></i></button>` : ""}
            ${p.status === "Đã thanh toán" ? `<button class="refund-btn" onclick="refundPayment('${paymentId}')"><i class="fas fa-rotate-left"></i></button>` : ""}
            <button class="delete-btn" onclick="deletePayment('${paymentId}')"> <i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
    });
    
    paymentTableBody.innerHTML = rowsHTML.join('');
  }
  
  // ======================= LỌC THANH TOÁN =======================
  function filterPayments() {
    const keyword = searchPayment.value.toLowerCase();
    const status = roleFilter.value;
    const course = roleFilterCourse.value;
    const fromDate = dateFrom.value ? new Date(dateFrom.value) : null;
    const toDate = dateTo.value ? new Date(dateTo.value) : null;
    
    const filtered = payments.filter((p) => {
      const studentName = p.studentName || p.student;
      const courseName = p.courseName || p.course;
      const paymentId = p.revenueID || p.id;
      
      const matchKeyword =
        paymentId.toLowerCase().includes(keyword) ||
        studentName.toLowerCase().includes(keyword) ||
        courseName.toLowerCase().includes(keyword);
      
      const matchStatus =
        status === "all" ||
        (status === "paid" && p.status === "Đã thanh toán") ||
        (status === "unpaid" && p.status === "Chưa thanh toán") ||
        (status === "confirm" && p.status === "Chờ xác nhận");
      
      const matchCourse = course === "all" || courseName.toLowerCase() === course;
      
      const paymentDateStr = p.paymentDate || p.date;
      const paymentDate = new Date(paymentDateStr);
      let matchDate = true;
      if (fromDate && paymentDate < fromDate) matchDate = false;
      if (toDate && paymentDate > toDate) matchDate = false;
      
      return matchKeyword && matchStatus && matchCourse && matchDate;
    });
    
    displayPayment(filtered);
    displayTotal(filtered);
  }
  
  // ======================= XEM CHI TIẾT =======================
  window.viewPayment = function(id) {
    const pay = payments.find((p) => (p.revenueID || p.id) === id);
    if (!pay) return alert("Không tìm thấy giao dịch này!");
    
    paymentModal.style.display = "flex";
    payId.textContent = pay.revenueID || pay.id;
    payName.textContent = pay.studentName || pay.student;
    payCourse.textContent = pay.courseName || pay.course;
    payAmount.textContent = (pay.amount ? pay.amount.toLocaleString() : 0) + "đ";
    payMethod.textContent = pay.paymentMethod || pay.method;
    payDate.textContent = pay.paymentDate || pay.date;
    payStatus.textContent = pay.status;
    
    document.getElementById("closeModalBtn").addEventListener("click", () => {
      paymentModal.style.display = "none";
    });
  };
  
  // ======================= XÓA GIAO DỊCH =======================
  window.deletePayment = async function(id) {
    if (!confirm("Bạn có chắc muốn xóa giao dịch này không?")) return;
    
    try {
      const response = await fetch(`https://localhost:7097/api/Revenue/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        alert("Xóa giao dịch thành công!");
        loadPayments();
      } else {
        alert("Xóa thất bại!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối API!");
    }
  };
  
  // ======================= XÁC NHẬN THANH TOÁN =======================
  window.confirmPayment = async function(id) {
    const pay = payments.find((p) => (p.revenueID || p.id) === id);
    if (!pay) return alert("Không tìm thấy giao dịch!");
    
    const updatedPayment = {
      ...pay,
      status: "Đã thanh toán"
    };
    
    try {
      const response = await fetch(`https://localhost:7097/api/Revenue/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayment),
      });
      
      if (response.ok) {
        alert("Xác nhận thành công!");
        loadPayments();
      } else {
        alert("Xác nhận thất bại!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối API!");
    }
  };
  
  // ======================= HOÀN TIỀN =======================
  window.refundPayment = async function(id) {
    const pay = payments.find((p) => (p.revenueID || p.id) === id);
    if (!pay) return alert("Không tìm thấy giao dịch!");
    
    const updatedPayment = {
      ...pay,
      status: "Đã hoàn tiền"
    };
    
    try {
      const response = await fetch(`https://localhost:7097/api/Revenue/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayment),
      });
      
      if (response.ok) {
        alert("Hoàn tiền thành công!");
        loadPayments();
      } else {
        alert("Hoàn tiền thất bại!");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Không thể kết nối API!");
    }
  };
  
  // ======================= MODAL THÊM GIAO DỊCH =======================
  const openBtn = document.getElementById("openAddPaymentModal");
  const cancelBtn = document.getElementById("cancelAddPayment");
  const modal = document.getElementById("addPaymentModal");
  const submitBtn = document.getElementById("submitNewPayment");
  
  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  }
  
  if (cancelBtn && modal) {
    cancelBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
  
  if (submitBtn) {
    submitBtn.addEventListener("click", async () => {
      const newPayment = {
        studentName: document.getElementById("newStudentName").value,
        courseName: document.getElementById("newCourseName").value,
        amount: parseFloat(document.getElementById("newAmount").value),
        paymentMethod: document.getElementById("newPaymentMethod").value,
        paymentDate: document.getElementById("newPaymentDate").value,
        status: document.getElementById("newStatus").value
      };
      
      // Kiểm tra dữ liệu đầu vào
      if (!newPayment.studentName || !newPayment.courseName || !newPayment.amount || 
          !newPayment.paymentMethod || !newPayment.paymentDate || !newPayment.status) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }
      
      try {
        const response = await fetch("https://localhost:7097/api/Revenue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPayment),
        });
        
        if (response.ok) {
          alert("Thêm giao dịch thành công!");
          modal.style.display = "none";
          
          // Reset form
          document.getElementById("newStudentName").value = "";
          document.getElementById("newCourseName").value = "";
          document.getElementById("newAmount").value = "";
          document.getElementById("newPaymentMethod").value = "";
          document.getElementById("newPaymentDate").value = "";
          document.getElementById("newStatus").value = "Chờ xác nhận";
          
          loadPayments();
        } else {
          const err = await response.json();
          console.error("API error:", err);
          alert("Thêm thất bại: " + (err.message || ""));
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Không thể kết nối API!");
      }
    });
  }
  
  // ======================= GẮN SỰ KIỆN LỌC =======================
  if (searchPayment) {
    searchPayment.addEventListener("input", filterPayments);
  }
  
  if (roleFilter) {
    roleFilter.addEventListener("change", filterPayments);
  }
  
  if (roleFilterCourse) {
    roleFilterCourse.addEventListener("change", filterPayments);
  }
  
  if (applyDate) {
    applyDate.addEventListener("click", filterPayments);
  }
  
  if (dateFrom && dateTo) {
    dateFrom.addEventListener("change", filterPayments);
    dateTo.addEventListener("change", filterPayments);
  }
  
  // ======================= KHỞI TẠO =======================
  // Gọi khi trang load
  loadPayments();
});# Commit 29 - 2026-01-10 16:56:54
