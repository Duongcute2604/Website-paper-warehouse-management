let assignments = JSON.parse(localStorage.getItem("assignments")) || [];
const assignmentID = localStorage.getItem("detailAssignmentId");

const assignment = assignments.find(
  (c) => String(c.id) === String(assignmentID)
);

if (!assignment) {
  alert("Không tìm thấy bài tập!");
  window.location.href = "Teacher/manage-homework.html";
}

// ==================================================== ELEMENTS ====================================================
const nameAssignment = document.getElementById("nameAss");
const nameCourse = document.getElementById("nameCourse");
const deadLine = document.getElementById("deadLine");
const timeWork = document.getElementById("timeWork");
const type = document.getElementById("type");
const description = document.getElementById("description");

// ========================== HIỂN THỊ ==========================
nameAssignment.innerHTML = assignment.title;
nameCourse.innerHTML = assignment.course;
deadLine.innerHTML = assignment.deadline;
timeWork.innerHTML = assignment.duration;
type.innerHTML = assignment.type;
description.innerHTML = assignment.description;
