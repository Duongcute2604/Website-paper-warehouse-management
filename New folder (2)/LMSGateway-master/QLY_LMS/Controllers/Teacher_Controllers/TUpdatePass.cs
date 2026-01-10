using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [ApiController]
    [Authorize(Roles = "Teacher")]
    [Route("api/[controller]")]
    public class TUpdatePass : ControllerBase
    {
        private readonly I_BLL_UpdatePass _Pass;

        public TUpdatePass(I_BLL_UpdatePass pass)
        {
            _Pass = pass;
        }

        private int GetTeacherID()
        {
            return int.Parse(User.FindFirst("userID").Value);

        }


        [HttpPut("update-password")]
        public IActionResult UpdatePassword([FromBody] update_pass pass)
        {
            int teacherID = GetTeacherID();
            if (!_Pass.UpdateTeacherPass(teacherID, pass, out string error))
            {
                return BadRequest(new { message = error });
            }

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }

    }
}
