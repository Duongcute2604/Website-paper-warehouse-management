/* char.js — lightweight renderer for report page chart
   - Expects window.reportChartValues (array of numbers in millions or objects with value)
   - Optionally window.reportChartLabels (array of strings)
   - Renders a column chart using the existing dashboard CSS classes
*/
(function () {
  function formatCurrencyVND(num) {
    try {
      return new Intl.NumberFormat('vi-VN').format(num) + ' đ';
    } catch (e) {
      return num + ' đ';
    }
  }

  // run after script is appended (defer true) — but guard with DOMContentLoaded
  function render() {
    const container = document.querySelector('.char-container');
    if (!container) return;

    let values = window.reportChartValues || [];
    const labels = window.reportChartLabels || [];

    // normalize: if values are in millions (numbers like 42), convert to VND
    // if values are objects with .value, use that (assume raw VND or millions depending on source)
    let monthly = [];
    if (Array.isArray(values) && values.length) {
      if (typeof values[0] === 'number') {
        // assume these numbers are in millions (report.js uses millions)
        monthly = values.map((v, i) => ({ month: labels[i] || `Tháng ${i + 1}`, value: Number(v) * 1000000 }));
      } else if (typeof values[0] === 'object') {
        monthly = values.map((v, i) => ({ month: v.month || labels[i] || `Tháng ${i + 1}`, value: Number(v.value) || 0 }));
      }
    }

    if (!monthly.length) {
      // fallback sample
      const sample = [1200000, 1800000, 900000, 2200000, 1600000, 1400000, 2000000, 1700000, 1500000, 1900000, 2100000, 2300000];
      monthly = sample.map((v, i) => ({ month: `Tháng ${i + 1}`, value: v }));
    }

    // Build chart DOM (same structure expected by CSS)
    container.innerHTML = '';
    const chartColumn = document.createElement('div');
    chartColumn.className = 'chart-column';

    const numberAndColumns = document.createElement('div');
    numberAndColumns.className = 'number-and-columns';

    const numberPercen = document.createElement('div');
    numberPercen.className = 'number-percen';
    // add percentage markers 100..0
    for (let i = 100; i >= 0; i -= 10) {
      const sp = document.createElement('span');
      sp.textContent = i;
      numberPercen.appendChild(sp);
    }

    const boxColumn = document.createElement('div');
    boxColumn.className = 'box-column';

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
      title.setAttribute('title', formatCurrencyVND(val));
      title.setAttribute('aria-label', formatCurrencyVND(val));

      col.appendChild(title);
      boxColumn.appendChild(col);
    });

    numberAndColumns.appendChild(numberPercen);
    numberAndColumns.appendChild(boxColumn);
    chartColumn.appendChild(numberAndColumns);

    // labels row
    const nameCourse = document.createElement('div');
    nameCourse.className = 'name-course';
    monthly.forEach((m) => {
      const sp = document.createElement('span');
      sp.textContent = m.month;
      nameCourse.appendChild(sp);
    });

    chartColumn.appendChild(nameCourse);

    container.appendChild(chartColumn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
