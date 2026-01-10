using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher.Request;
using QLY_LMS.Models.MTeacher.Response;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [ApiController]
    [Authorize(Roles = "Teacher")]
    [Route("api/[controller]")]
    public class AssignmentController : ControllerBase
    {
        private readonly I_BLL_ManageAssignment _manageAssignment;

        public AssignmentController(I_BLL_ManageAssignment manageAssignment)
        {
            _manageAssignment = manageAssignment;
        }

        private int GetTeacherID()
        {
            return  (int)HttpContext.Items["UserID"];
        }

        [HttpGet("get-all-assignment/{videoID}")]
        public IActionResult GetAssignments(int videoID)
        {
            var result = _manageAssignment.GetAssignments(videoID, GetTeacherID());
            if(result.Count == 0)
            {
                return NotFound("Không tìm thấy bài tập trong video!");
            }
            return Ok(result);
        }
        [HttpGet("get-all-assignments")]
        public IActionResult GetAllAssignments()
        {
            var result = _manageAssignment.getAllAssignment(GetTeacherID());
            if (result.Count == 0)
            {
                return NotFound("Không tìm thấy bài tập nào!");
            }
            return Ok(result);
        }
        [HttpGet("get-assignment-by-id/{assignmentID}")]
        public IActionResult GetAssignmentById(int assignmentID)
        {
            var result = _manageAssignment.getAssignmentById(assignmentID, GetTeacherID());
            if (result.Count == 0)
            {
                return NotFound("Không tìm thấy bài tập!");
            }
            return Ok(result);
        }

        [HttpPost("create-assignment")]
        public IActionResult Create([FromBody] AssignmentRequest req)
        {
            _manageAssignment.CreateAssignment(req, GetTeacherID());
            return Ok("tạo bài tập thành công!");
        }

        [HttpPut("update-assignment")]
        public IActionResult Update([FromBody] Assignment req)
        {
            _manageAssignment.UpdateAssignment(req, GetTeacherID());
            return Ok("cập nhật bài tập thành công!");
        }

        [HttpDelete("delete-assignment/{assignmentID}")]
        public IActionResult Delete(int assignmentID)
        {
            _manageAssignment.DeleteAssignment(assignmentID, GetTeacherID());
            return Ok("xóa bài tập thành công!");
        }
    }
}
