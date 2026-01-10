using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;
using QLY_LMS.Models.MTeacher.Response;

namespace QLY_LMS.Controllers.Teacher_Controllers
{
    [ApiController]
    [Authorize(Roles = "Teacher")]
    [Route("api/[controller]")]
    public class QuestionController : ControllerBase
    {
        private readonly I_BLL_Question _manageQuestion;

        public QuestionController(I_BLL_Question manageQuestion)
        {
            _manageQuestion = manageQuestion;
        }

        private int GetTeacherID()
        {
            return (int)HttpContext.Items["UserID"];
        }

        [HttpGet("get-question/{assignmentID}")]
        public IActionResult GetAllQuestions(int assignmentID)
        {
            var result = _manageQuestion.GetAllQuestion(assignmentID, GetTeacherID());
            if (result.Count == 0)
                return NotFound("Không tìm thấy câu hỏi trong bài tập này!");
            return Ok(result);
        }

        [HttpPost("create-new-question")]
        public IActionResult Create([FromBody] QuestionRequest req)
        {
            _manageQuestion.CreateQuestion(req, GetTeacherID());
            return Ok("Tạo câu hỏi thành công!");
        }

        [HttpPut("update-question")]
        public IActionResult Update([FromBody] Question req)
        {
            _manageQuestion.UpdateQuestion(req, GetTeacherID());
            return Ok("Cập nhật câu hỏi thành công!");
        }

        [HttpDelete("delete-question/{questionID}")]
        public IActionResult Delete(int questionID)
        {
            _manageQuestion.DeleteQuestion(questionID, GetTeacherID());
            return Ok("Xóa câu hỏi thành công!");
        }
    }
}
