using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.Controllers.Teacher_Controllers;
using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

[Authorize(Roles = "Teacher")]
[Route("api/[controller]")]
[ApiController]
public class VideoController : ControllerBase
{
    private readonly I_BLL_ManageVideoCourse _service;

    public VideoController(I_BLL_ManageVideoCourse service)
    {
        _service = service;
    }

    private int GetTeacherID()
    {
        return int.Parse(User.FindFirst("userID").Value);

    }


    [HttpGet("get-all-video/{courseID}")]
    public IActionResult GetAll(int courseID)
    {
        int teacherID = GetTeacherID();

        var list_video = _service.GetAllVideo(courseID, teacherID);

        if(list_video == null)
        {
            return BadRequest("khóa học chưa có video!");
        }
        return Ok(list_video);
    }

    [HttpPost("create-new-video")]
    public IActionResult Create(create_video video)
    {
        int teacherID = GetTeacherID();

        _service.CreateVideo(video, teacherID);

        return Ok(new { message = "tạo mới video thành công!" });
    }

    [HttpPut("update-video")]
    public IActionResult Update(Video_courseRequest video)
    {
        int teacherID = GetTeacherID();

        _service.UpdateVideo(video, teacherID);

        return Ok(new { message = "sửa video thành công!" });
    }

    [HttpDelete("delete-video/{videoID}")]
    public IActionResult Delete(int videoID)
    {
        int teacherID = GetTeacherID();

        _service.DeleteVideo(videoID, teacherID);

        return Ok(new { message = "xóa video thành công!" });
    }
}
