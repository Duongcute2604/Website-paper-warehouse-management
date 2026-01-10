using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [ApiController]
    [Authorize(Roles = "Teacher")]
    [Route("api/[controller]")]
    public class InfoController : ControllerBase
    {
        private readonly I_BLL_Info _manageInfo;
        public InfoController(I_BLL_Info manageInfo)
        {
            _manageInfo = manageInfo;
        }
        private int GetTeacherID()
        {
            return (int)HttpContext.Items["UserID"];
        }
        [HttpGet("get-info-teacher")]
        public IActionResult GetInfoTeacher()
        {
            var result = _manageInfo.GetInfoTeacher(GetTeacherID());
            if (result.Count == 0)
                return NotFound("Không tìm thấy thông tin giáo viên!");
            return Ok(result);
        }

        [HttpPut("update-info-teacher")]
        public IActionResult UpdateInfoTeacher([FromBody] info_teacher info)
        {
            bool result = _manageInfo.UpdateInfoTeacher(GetTeacherID(), info);
            if (!result)
                return BadRequest("Cập nhật thông tin giáo viên thất bại!");
            return Ok("Cập nhật thông tin giáo viên thành công!");
        }
    }
}
