using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_ManageVideoCourse : I_BLL_ManageVideoCourse
    {
        private readonly I_DAL_ManageVideoCourse _ManageCourse;

        public BLL_ManageVideoCourse(I_DAL_ManageVideoCourse dal)
        {
            _ManageCourse = dal;
        }

        public List<Video_course> GetAllVideo(int courseID, int teacherID)
        {
            return _ManageCourse.GetAllVideo(courseID, teacherID);

        }

        public bool CreateVideo(create_video video, int teacherID)
        {
            return _ManageCourse.CreateVideo(video, teacherID);
        }

        public bool UpdateVideo(Video_courseRequest video, int teacherID)
        {
            return _ManageCourse.UpdateVideo(video, teacherID);
        }

        public bool DeleteVideo(int videoID, int teacherID)
        {
            return _ManageCourse.DeleteVideo(videoID, teacherID);
        }
    }
}
