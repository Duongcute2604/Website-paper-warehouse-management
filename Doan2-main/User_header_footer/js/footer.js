fetch("footer.html")
  .then((response) => {
    if (!response.ok) throw new Error("Không tìm thấy footer.html");
    return response.text();
  })
  .then((data) => {
    document.getElementById("main-footer").innerHTML = data;
  })
  .catch((error) => console.error("Lỗi fetch:", error));
# Commit 130 - 2026-01-10 16:57:23
