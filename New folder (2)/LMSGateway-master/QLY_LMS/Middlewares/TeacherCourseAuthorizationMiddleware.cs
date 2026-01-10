using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using System.Text.Json;

public class TeacherCourseAuthorizationMiddleware
{
    private readonly RequestDelegate _next;

    public TeacherCourseAuthorizationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context, I_BLL_ManageCourse courseService)
    {
        var path = context.Request.Path.Value.ToLower();

        // Chỉ intercept API thao tác trên course hoặc video
        if (path.Contains("/api/video") || path.Contains("/api/teacher"))
        {
            int? courseId = null;

            // Try lấy courseID từ route
            if (context.Request.RouteValues.ContainsKey("courseID"))
            {
                courseId = int.Parse(context.Request.RouteValues["courseID"].ToString());
            }
            else if (context.Request.Method != "GET" &&
                     context.Request.ContentType != null &&
                     context.Request.ContentType.Contains("application/json"))
            {
                // Try lấy courseID từ body JSON
                context.Request.EnableBuffering();
                using var reader = new StreamReader(context.Request.Body, leaveOpen: true);
                var body = await reader.ReadToEndAsync();
                context.Request.Body.Position = 0;

                if (body.Contains("courseID"))
                {
                    var obj = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(body);
                    if (obj.TryGetProperty("courseID", out var cid))
                    {
                        courseId = cid.GetInt32();
                    }
                }
            }

            // Nếu có courseID thì check quyền
            if (courseId.HasValue &&
                context.Items.TryGetValue("UserID", out var teacherObj))
            {
                int teacherId = (int)teacherObj;

                bool allowed = courseService.CheckCourseOfTeacher(courseId.Value, teacherId);

                if (!allowed)
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    await context.Response.WriteAsJsonAsync(new
                    {
                        error = "Bạn không có quyền thao tác khóa học này."
                    });
                    return;
                }
            }
        }

        await _next(context);
    }
}
