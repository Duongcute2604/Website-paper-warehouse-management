fetch("header.html")
  .then((response) => {
    if (!response.ok) throw new Error("Không tìm thấy header.html");
    return response.text();
  })
  .then((data) => {
    document.getElementById("main-header").innerHTML = data;
    /*toggle menu icon */
    const menuIcon = document.querySelector("#menu-icon");
    const navBarMenuIconActive = document.querySelector(
      ".nav-bar-menu-icon-active"
    );

    menuIcon.addEventListener("click", () => {
      navBarMenuIconActive.classList.toggle("active");
      menuIcon.classList.toggle("fa-bars");
      menuIcon.classList.toggle("fa-x");
    });
    updateLoginStatus();
  })
  .catch((error) => console.error("Lỗi fetch:", error));

function updateLoginStatus() {
  const loginTable = document.querySelector(".login");
  const currentUser = localStorage.getItem("savedUsername");
  const currentPass = localStorage.getItem("savedPassword");

  if (currentUser && currentPass) {
    loginTable.innerHTML = `
      <span>Chào mừng: ${currentUser} | <a href="#" id="logout">Đăng xuất</a></span>
    `;
    document.getElementById("logout").addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("savedUsername");
      localStorage.removeItem("savedPassword");
      localStorage.removeItem("savedRole");
      window.location.reload();
    });
  }
  // else {
  //   loginTable.innerHTML = `
  //   <span><a href="${
  //     window.location.pathname.includes("web_children")
  //       ? "../login_register/login.html"
  //       : "./login_register/login.html"
  //   }">Đăng nhập/Đăng ký</a></span>
  // `;
  // }
}
