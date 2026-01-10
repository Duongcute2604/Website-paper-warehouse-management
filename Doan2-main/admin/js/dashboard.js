/* dashboard.js
   - Hiển thị biểu đồ doanh thu hàng tháng một cách linh hoạt (dynamic)
    - Điền dữ liệu vào các thẻ thống kê hàng đầu và bảng người dùng gần đây bằng dữ liệu mẫu từ `fakeData.js`.
    - Nếu `window.monthlyRevenue` được cung cấp (mảng số hoặc đối tượng), nó sẽ được sử dụng.
*/
(function () {
  function formatCurrency(value) {
    try {
      return new Intl.NumberFormat('vi-VN').format(value) + ' đ';
    } catch (e) {
      return value + ' đ';
    }
  }

  function safeGet(id) {
    return document.getElementById(id);
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Populate top stats from fakeData.js if available
    if (window.stats) {
      const userEl = safeGet('userCount');
      const courseEl = safeGet('courseCount');
      const sessionEl = safeGet('sessionCount');
      const revenueEl = safeGet('revenue');

      if (userEl) userEl.textContent = stats.users ?? userEl.textContent;
      if (courseEl) courseEl.textContent = stats.courses ?? courseEl.textContent;
      if (sessionEl) sessionEl.textContent = stats.sessions ?? sessionEl.textContent;
      if (revenueEl) revenueEl.textContent = formatCurrency(stats.revenue ?? 0);
    }

    // Populate recent users table
    const tbody = document.getElementById('userTable');
    if (tbody && Array.isArray(window.newUsers)) {
      tbody.innerHTML = '';
      newUsers.forEach((u) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${u.name}</td><td>${u.email}</td><td>${u.date}</td>`;
        tbody.appendChild(tr);
      });
    }

    // Build monthly revenue source
      const container = document.querySelector('.chart-column-container');
      const apiUrlFromAttr = container?.dataset?.apiUrl || container?.getAttribute('data-api-url');
      const apiUrl = window.dashboardApiUrl || apiUrlFromAttr || null;

      // helper: render monthly data (same logic as before)
      function renderMonthly(monthlySource) {
        let monthly = monthlySource || [];
        if (!Array.isArray(monthly)) monthly = [];

        if (monthly.length && typeof monthly[0] === 'number') {
          monthly = monthly.map((v, i) => ({ month: `Tháng ${i + 1}`, value: v }));
        }

        const boxColumn = document.querySelector('.box-column');
        const nameCourse = document.querySelector('.name-course');
        if (!boxColumn || !nameCourse || !Array.isArray(monthly)) return;

        boxColumn.innerHTML = '';
        nameCourse.innerHTML = '';

        const maxValue = Math.max(...monthly.map((m) => Number(m.value) || 0), 1);
        const colorVars = ['var(--blue-)', 'var(--green)', 'var(--orange)', 'var(--purple)', 'var(--red)'];

        monthly.forEach((m, idx) => {
          const val = Number(m.value) || 0;
          const percent = Math.round((val / maxValue) * 100);

          const col = document.createElement('div');
          col.className = 'chart-serie';
          col.style.setProperty('--i', percent + '%');
          col.style.setProperty('--color', colorVars[idx % colorVars.length]);
          const title = document.createElement('h3');
          title.className = 'column-title';
          title.textContent = percent + '%';
          title.setAttribute('title', formatCurrency(val));
          title.setAttribute('aria-label', formatCurrency(val));
          col.appendChild(title);
          boxColumn.appendChild(col);

          const label = document.createElement('span');
          label.textContent = m.month ?? `Tháng ${idx + 1}`;
          nameCourse.appendChild(label);
        });
      }

      // Attempt to fetch from API when provided.
      if (apiUrl) {
        // show a simple loading state in the chart area
        const boxColumn = document.querySelector('.box-column');
        if (boxColumn) boxColumn.innerHTML = '<div style="padding:1rem">Đang tải dữ liệu...</div>';

        fetch(apiUrl, { method: 'GET', credentials: 'same-origin' })
          .then((res) => {
            if (!res.ok) throw new Error('Network response not ok');
            return res.json();
          })
          .then((data) => {
            let payload = data;
            if (data && typeof data === 'object' && !Array.isArray(data)) {
              if (Array.isArray(data.monthly)) payload = data.monthly;
              else if (Array.isArray(data.data)) payload = data.data;
            }

            if (!Array.isArray(payload) || payload.length === 0) {
              throw new Error('Invalid payload');
            }

            renderMonthly(payload);
          })
          .catch((err) => {
            console.warn('Failed to load dashboard API, falling back to local data.', err);
            // fallback to existing logic below (use chartData/window.monthlyRevenue)
            proceedWithLocalData();
          });
        // stop here — render will be handled by fetch result or fallback
        return;
      }

      // No API URL provided — continue with previous local data logic
      function proceedWithLocalData() {
        let monthly = null;
        if (window.monthlyRevenue) {
          monthly = window.monthlyRevenue;
        } else if (window.chartData && Array.isArray(chartData) && chartData.length) {
          // use chartData values if provided in fakeData
          monthly = chartData.map((c, i) => ({ month: c.month ?? `Tháng ${i + 1}`, value: Number(c.value) || 0 }));
        } else {
          // fallback sample for 12 months (demo data)
          const sample = [1200000, 1800000, 900000, 2200000, 1600000, 1400000, 2000000, 1700000, 1500000, 1900000, 2100000, 2300000];
          monthly = sample.map((v, i) => ({ month: `Tháng ${i + 1}`, value: v }));
        }

        renderMonthly(monthly);
      }

      proceedWithLocalData();
  });
})();
