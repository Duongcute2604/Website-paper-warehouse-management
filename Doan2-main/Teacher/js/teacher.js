const nameTeacher = localStorage.getItem("savedUsername");

const titleComback = document.querySelector(".title-comback");

function render() {
  if (titleComback) {
    titleComback.innerHTML = `<h2>
            Chào mừng trở lại,
            <span style="color: var(--blue-)">GV. ${nameTeacher}!</span> 👋
          </h2>
          <p style="color: var(--grey)">Hôm nay: Thứ Bảy, 08/11/2025</p>
        `;
  }
}

render();
