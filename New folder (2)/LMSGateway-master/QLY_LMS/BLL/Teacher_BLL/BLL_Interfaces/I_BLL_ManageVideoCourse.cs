using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces
{
    public interface I_BLL_ManageVideoCourse
    {
        List<Video_course> GetAllVideo(int courseID, int teacherID);
        bool CreateVideo(create_video video, int teacherID);
        bool UpdateVideo(Video_courseRequest video, int teacherID);
        bool DeleteVideo(int videoID, int teacherID);

    }
}
