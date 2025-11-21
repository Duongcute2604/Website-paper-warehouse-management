// Hiển thị số liệu tổng
document.getElementById("userCount").textContent = stats.users;
document.getElementById("courseCount").textContent = stats.courses;
document.getElementById("sessionCount").textContent = stats.sessions;
document.getElementById("revenue").textContent = stats.revenue.toLocaleString();

function new_user(newUsers) {
  const tableBody = document.getElementById("userTable");
  let newuser = "";
  for (let i = 0; i < newUsers.length; i++) {
    newuser += `
      <tr>
        <td>${newUsers[i].name}</td>
        <td>${newUsers[i].email}</td>
        <td>${newUsers[i].date}</td>
      </tr>
    `;
  }
  tableBody.innerHTML = newuser;
}

new_user(newUsers);
