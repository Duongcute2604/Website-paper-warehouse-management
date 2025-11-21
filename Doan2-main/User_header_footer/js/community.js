// ========================== DỮ LIỆU GIẢ ==========================
const posts = [
  {
    id: 1,
    author: "Lan",
    avt: "L",
    time: "2 giờ trước",
    cat: "Ngữ pháp",
    content: "Cách sử dụng thì Hiện tại đơn và ví dụ cụ thể: I eat, he eats...",
    likes: 0,
    comments: 0,
  },
  {
    id: 2,
    author: "Minh",
    avt: "M",
    time: "1 ngày trước",
    cat: "TT",
    content: "500 từ vựng cơ bản cho người mới bắt đầu: apple, book, chair...",
    likes: 0,
    comments: 0,
  },
  {
    id: 3,
    author: "Hương",
    avt: "H",
    time: "3 ngày trước",
    cat: "Trang cá nhân",
    content: "Mẹo luyện nghe mỗi ngày: nghe podcast, chép chính tả...",
    likes: 0,
    comments: 0,
  },
];

// ========================== BIẾN TOÀN CỤC ==========================
const postList = document.getElementById("postList");
const postModal = document.getElementById("postModal");
const modalMeta = document.getElementById("modalMeta");
const modalContent = document.getElementById("modalContent");
const commentsEl = document.getElementById("comments");
const commentInput = document.getElementById("commentInput");
const closeModal = document.getElementById("closeModal");
const newPostBtn = document.getElementById("newPostBtn");
const newPostModal = document.getElementById("newPostModal");
const closeNewPost = document.getElementById("closeNewPost");
const createPost = document.getElementById("createPost");
const categories = document.querySelectorAll(".cat");
const searchInput = document.getElementById("searchInput");
const postImageInput = document.getElementById("postImage");
const imagePreview = document.getElementById("imagePreview");
const avatarElements = document.querySelector(".actions .avatar");
const generalBtn = document.getElementById("generalBtn");
const imgSearch = document.querySelector(".img-search");
const profileSection = document.getElementById("profileSection");

let currentFilter = "Tổng hợp";
let currentPost = null;
let commentsMap = {}; // postId -> comments array
let fullName = "";
const currentUser = localStorage.getItem("savedUsername") || "Bạn"; //LẤY TỪ LOCAL

// ========================== KIỂM TRA ĐĂNG NHẬP ==========================
function isLoggedIn() {
  const user = localStorage.getItem("savedUsername");
  return !!user; // trả về true nếu có user
}

// ========================== HÀM HIỂN THỊ TÊN ICON TRÊN CÙNG==========================
// function renderIconNames() {
//   if (!isLoggedIn()) {
//     avatarElements.textContent = "?";
//   } else {
//     avatarElements.textContent = `${currentUser[0]}`;
//   }
//   posts.forEach((post) => {
//     if (post.cat === "Trang cá nhân") {
//       avatarElements.textContent = `${post.author[0]}`;
//     }
//   });
// }

function getFullName() {
  posts.forEach((post) => {
    if (post.cat === "Trang cá nhân") {
      fullName = post.author;
    }
  });
}

// ========================== HÀM HIỂN THỊ DANH SÁCH ==========================
function renderList() {
  if (!isLoggedIn()) {
    postList.innerHTML = `
    <div style="padding:40px;text-align:center;color:#6b7280;font-size:18px;">
      Vui lòng <a href="../User_header_footer/login.html" style="color:#2563eb;">đăng nhập</a> để xem các bài viết.
    </div>`;
    return;
  }
  postList.innerHTML = "";
  const q = (searchInput.value || "").toLowerCase();

  const filtered = posts.filter((p) => {
    return (p.content || "").toLowerCase().includes(q);
  });

  if (filtered.length === 0) {
    postList.innerHTML =
      '<div style="padding:20px;color:#6b7280">Không có bài viết trong danh mục này.</div>';
    return;
  }

  filtered.forEach((p) => {
    const el = document.createElement("div");
    el.className = "post";
    el.innerHTML = `
  <div class="top-content">
    <div class="left">
      <div class="avt-name-title">
        <div class="c-avatar">${p.avt || "U"}</div>
        <div class="meta">Bởi ${p.author} • ${p.time}</div>
      </div>
      <div class="title">${p.content}</div>
      <div class="PostImg">${
        p.image ? `<img src="${p.image}" class="post-image" />` : ""
      }</div>
    </div>
  </div>
  <div class="icons-action">
    <div class="icon-card heart-card">
      <i class="fa-solid fa-heart"></i>
      <p class="count-heart">${p.likes || 0}</p>
    </div>
    <div class="icon-card message-card">
      <i class="fa-solid fa-message"></i>
      <p class="count-message">${p.comments || 0}</p>
    </div>
  </div>
`;

    // --- Click mở bài ---
    el.addEventListener("click", (e) => {
      if (e.target.closest(".icon-card")) return;
      openPost(p.id);
    });

    // --- ❤️ Like ---
    const heartCard = el.querySelector(".heart-card");
    const heartIcon = heartCard.querySelector("i");
    const heartCount = heartCard.querySelector(".count-heart");

    if (typeof p._liked === "undefined") p._liked = false;
    heartIcon.style.color = p._liked ? "red" : "";
    heartCount.textContent = p.likes;

    heartCard.addEventListener("click", (e) => {
      e.stopPropagation();
      p._liked = !p._liked;
      if (p._liked) {
        p.likes++;
        heartIcon.style.color = "red";
      } else {
        p.likes = Math.max(0, p.likes - 1);
        heartIcon.style.color = "";
      }
      heartCount.textContent = p.likes;
    });

    // --- 💬 Mở chi tiết khi click icon message ---
    const msgCard = el.querySelector(".message-card");
    msgCard.addEventListener("click", (e) => {
      e.stopPropagation();
      openPost(p.id);
    });

    postList.appendChild(el);
  });
}

// ========================== HÀM HIỂN THỊ TÊN ICON TRÊN CÙNG ==========================
function renderIconNames() {
  if (!isLoggedIn()) {
    avatarElements.textContent = "?";
    return;
  }
  avatarElements.textContent = currentUser[0].toUpperCase();
}

function getFullName() {
  fullName = currentUser;
}

// ========================== HÀM HIỂN THỊ TRANG CÁ NHÂN ==========================

function renderMyPosts() {
  if (!isLoggedIn()) {
    profileSection.innerHTML = `
      <div class="c-avatar"
        style="
          width: 80px;
          height: 80px;
          font-size: 30px;
          margin: 0 auto;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        ">
        ${"?"}
      </div>
      <h3 style="margin-top: 10px"></h3>
      `;
    return;
  }
  postList.innerHTML = "";
  const q = (searchInput.value || "").toLowerCase();
  const myPosts = posts.filter(
    (p) => p.cat === "Trang cá nhân" && p.content.toLowerCase().includes(q)
  );

  // const profileSection = document.getElementById("profileSection");
  if (myPosts.length > 0) {
    profileSection.innerHTML = `
      <div class="c-avatar"
        style="
          width: 80px;
          height: 80px;
          font-size: 30px;
          margin: 0 auto;
          background: #2563eb;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        ">
        ${currentUser[0] || "U"}
      </div>
      <h3 style="margin-top: 10px">${currentUser}</h3>
      <p style="color: gray">Bài viết của tôi</p>`;
    return;
  }

  if (myPosts.length === 0) {
    postList.innerHTML =
      '<div style="padding:20px;color:#6b7280;text-align:center;">Bạn chưa đăng bài nào.</div>';
    return;
  }

  // Tạo danh sách bài viết
  myPosts.forEach((p) => {
    const el = document.createElement("div");
    el.className = "post";
    el.innerHTML = `
      <div class="top-content">
        <div class="left">
          <div class="avt-name-title">
            <div class="c-avatar">${(p.author && p.author[0]) || "U"}</div>
            <div class="meta">Bởi ${p.author} • ${p.time}</div>
          </div>
          <div class="title">${p.content}</div>
          ${p.image ? `<img src="${p.image}" class="post-image" />` : ""}
        </div>
      </div>
      <div class="icons-action">
        <div class="icon-card heart-card" data-id="${p.id}">
          <i class="fa-solid fa-heart" style="color:${
            p._liked ? "red" : ""
          }"></i>
          <p class="count-heart">${p.likes || 0}</p>
        </div>
        <div class="icon-card message-card" data-id="${p.id}">
          <i class="fa-solid fa-message"></i>
          <p class="count-message">${p.comments || 0}</p>
        </div>
      </div>
    `;
    el.addEventListener("click", () => openPost(p.id));
    postList.appendChild(el);
  });

  // Gán sự kiện tim ❤️ (làm sau khi render hết)
  const hearts = postList.querySelectorAll(".heart-card");
  hearts.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const post = posts.find((p) => p.id === id);
      if (!post) return;
      post._liked = !post._liked;
      post.likes += post._liked ? 1 : -1;
      renderMyPosts(); // render lại để cập nhật giao diện
    });
  });

  // Gán sự kiện mở chi tiết 💬
  const msgs = postList.querySelectorAll(".message-card");
  msgs.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      openPost(id);
    });
  });
}

// ========================== HÀM MỞ BÀI CHI TIẾT ==========================
function openPost(id) {
  const p = posts.find((x) => x.id === id);
  if (!p) return;
  currentPost = p;

  modalMeta.innerHTML = `
    <div class="avt-name-title">
      <div class="c-avatar">${(p.author && p.author[0]) || "U"}</div>
      <div class="meta">Bởi ${p.author} • ${p.time}</div>
    </div>`;

  modalContent.innerHTML = `
    <div class="text-content">${p.content}</div>
    ${p.image ? `<img src="${p.image}" class="post-image" />` : ""}
  `;

  renderComments();
  postModal.setAttribute("aria-hidden", "false");
}

// ========================== ĐÓNG MODAL ==========================
function closeModalFn() {
  postModal.setAttribute("aria-hidden", "true");
}

// ========================== HIỂN THỊ BÌNH LUẬN ==========================
function renderComments() {
  commentsEl.innerHTML = "";
  const arr = commentsMap[currentPost.id] || [];
  if (arr.length === 0) {
    commentsEl.innerHTML =
      '<div style="color:#6b7280;padding:8px 0">Chưa có bình luận</div>';
    return;
  }
  arr.forEach((c) => {
    const e = document.createElement("div");
    e.className = "comment";
    e.innerHTML = `
      <div class="c-avatar">${(c.name && c.name[0]) || "U"}</div>
      <div class="c-body">
        <strong>${c.name}</strong>
        <div class="c-meta">${c.time}</div>
        <div>${c.text}</div>

      </div>`;
    commentsEl.appendChild(e);
  });
}

// ========================== GỬI BÌNH LUẬN ==========================
document.getElementById("sendComment").addEventListener("click", () => {
  const txt = document.getElementById("commentInput").value.trim();
  if (!txt) {
    return alert("Viết bình luận trước khi gửi");
  }

  // Lấy danh sách bình luận của bài hiện tại
  const arr = (commentsMap[currentPost.id] = commentsMap[currentPost.id] || []);
  arr.push({ name: fullName, time: "vừa xong", text: txt });

  // Cập nhật số lượng bình luận của bài
  currentPost.comments = arr.length;

  // Xóa input, render lại phần bình luận
  commentInput.value = "";
  renderComments();

  // Render lại danh sách bài để cập nhật số bình luận trong icon 💬
  if (currentFilter === "Trang cá nhân") {
    renderMyPosts();
  } else {
    renderList();
  }
});

// ========================== SỰ KIỆN MODAL ==========================
closeModal.addEventListener("click", closeModalFn);
postModal.addEventListener("click", (e) => {
  if (e.target === postModal) closeModalFn();
});

// ========================== TẠO BÀI MỚI ==========================
newPostBtn.addEventListener("click", () => {
  if (!isLoggedIn()) {
    alert("Bạn cần đăng nhập để đăng bài!");
    return;
  }
  newPostModal.setAttribute("aria-hidden", "false");
});
closeNewPost.addEventListener("click", () =>
  newPostModal.setAttribute("aria-hidden", "true")
);
newPostModal.addEventListener("click", (e) => {
  if (e.target === newPostModal)
    newPostModal.setAttribute("aria-hidden", "true");
});

// ========================== NÚT ĐĂNG BÀI VIẾT  ==========================
const setNamePost = document.querySelector(".avt_create");
posts.forEach((post) => {
  if (post.cat === "Trang cá nhân") {
    setNamePost.querySelector(".c-avatar").textContent = currentUser[0] || "U";
    setNamePost.querySelector(".meta").textContent = currentUser || "Bạn";
  }
});

const chooseImgBtn = document.querySelector(".btn-choose-img");
chooseImgBtn.addEventListener("click", () => {
  postImageInput.click(); // mở hộp thoại chọn ảnh
});

createPost.addEventListener("click", () => {
  const body = document.getElementById("postBody").value.trim();
  const imgInput = document.getElementById("postImage");
  const file = imgInput.files[0];

  if (!body && !file) {
    return alert("Vui lòng viết nội dung hoặc chọn ảnh");
  }
  const avt = currentUser[0] || "Bạn";
  const id = posts.length ? Math.max(...posts.map((p) => p.id)) + 1 : 1;

  // Hàm thêm bài
  const addPost = (imageBase64 = null) => {
    posts.unshift({
      id,
      author: currentUser,
      avt: avt,
      time: "vừa xong",
      cat: "Trang cá nhân",
      content: body || "",
      image: imageBase64,
      likes: 0,
      comments: 0,
    });

    document.getElementById("postBody").value = "";
    document.getElementById("postImage").value = "";
    document.getElementById("imagePreview").src = "";
    newPostModal.setAttribute("aria-hidden", "true");
    // kiểm tra xem đang ở thẻ Cat nào
    if (currentFilter === "Trang cá nhân") {
      renderMyPosts();
    } else {
      renderList();
    }
  };

  // Nếu có file ảnh thì đọc base64
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => addPost(e.target.result);
    reader.readAsDataURL(file);
  } else {
    addPost();
  }
});
// ========================== CHUYỂN DANH MỤC ==========================
categories.forEach((c) => {
  c.addEventListener("click", () => {
    document
      .querySelectorAll(".cat")
      .forEach((x) => x.classList.remove("active"));
    c.classList.add("active");
    currentFilter = c.getAttribute("data-cat");

    const panelTitle = document.getElementById("panelTitle");
    const profileSection = document.getElementById("profileSection");

    if (currentFilter === "Trang cá nhân") {
      panelTitle.textContent = "Trang cá nhân";
      profileSection.style.display = "block";
      renderMyPosts();
    } else {
      panelTitle.textContent = "Bài viết mới nhất";
      profileSection.style.display = "none";
      renderList();
    }
  });
});

searchInput.addEventListener("input", () => {
  if (currentFilter === "Trang cá nhân") {
    renderMyPosts();
  } else {
    renderList();
  }
});

// ========================== MỞ TRANG CÁ NHÂN KHI ẤN AVATAR ==========================
const avatarBtn = document.querySelector(".avatar");

if (avatarBtn) {
  avatarBtn.addEventListener("click", () => {
    if (!isLoggedIn()) {
      alert("Bạn chưa đăng nhập!");
      return;
    }
    document
      .querySelectorAll(".cat")
      .forEach((x) => x.classList.remove("active"));
    const personalTab = document.querySelector('[data-cat="Trang cá nhân"]');
    if (personalTab) personalTab.classList.add("active");

    currentFilter = "Trang cá nhân";
    const panelTitle = document.getElementById("panelTitle");
    const profileSection = document.getElementById("profileSection");

    panelTitle.textContent = "Trang cá nhân";
    profileSection.style.display = "block";
    renderMyPosts();
  });
}
// ==========================MỞ TRANG TỔNG HỢP KHI ẤN ICON (GIAO DIỆN 768)  ==========================
if (generalBtn) {
  generalBtn.addEventListener("click", () => {
    if (!isLoggedIn()) {
      alert("Bạn chưa đăng nhập!");
      return;
    }
    document
      .querySelectorAll(".cat")
      .forEach((x) => x.classList.remove("active"));
    const generalTab = document.querySelector('[data-cat="Tổng hợp"]');
    if (generalTab) generalTab.classList.add("active");
    currentFilter = "Tổng hợp";
    const panelTitle = document.getElementById("panelTitle");
    const profileSection = document.getElementById("profileSection");
    panelTitle.textContent = "Bài viết mới nhất";
    profileSection.style.display = "none";
    renderList();
  });
}

// ========================== HIỂN THỊ INPUT KHI ẤN ICON TÌM KIẾM ==========================
imgSearch.addEventListener("click", () => {
  imgSearch.classList.toggle("active");
  searchInput.style.top = imgSearch.classList.contains("active")
    ? "100%"
    : "-200%";
});

// ========================== XEM TRƯỚC ẢNH ==========================

postImageInput.addEventListener("change", () => {
  const file = postImageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "";
    imagePreview.style.display = "none";
  }
});

// ========================== KHỞI TẠO ==========================

renderIconNames();
getFullName();
renderList();
