using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Teacher")]
    public class TManageStudent : ControllerBase
    {
        private readonly I_BLL_ManageStudent _BLL_ManageStudent;
        public TManageStudent(I_BLL_ManageStudent manageStudent)
        {
            _BLL_ManageStudent = manageStudent;
        }
        private int getTeacherID()
        {
            return (int)HttpContext.Items["UserID"];
        }

        [HttpGet("get-all-student")]
        public IActionResult getstudent()
        {
            int teacher = getTeacherID();
            var student = _BLL_ManageStudent.getAllStudent(teacher);

            if(student.Count == 0)
            {
                return BadRequest("Bạn chưa có sinh viên đăng ký khóa học nào cả!");
            }
            return Ok(student);
        }

        [HttpGet("get-all-student-by-course/{courseID}")]
        public IActionResult getstudentCourse(int courseID)
        {
            int teacher = getTeacherID();
            var student = _BLL_ManageStudent.getAllStudentCourse(teacher, courseID);

            if (student.Count == 0)
            {
                return BadRequest("Bạn chưa có sinh viên đăng ký khóa học nào cả!");
            }
            return Ok(student);
        }
    }
}
