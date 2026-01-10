using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces
{
    public interface I_BLL_ManageCourse
    {
        List<Course> getAllCoures(int Tid);
        bool createCourse(CourseRequest coures);
        bool updateCourse(int courseID, Course course);

        bool deleteCourse(int courseID, int teacherID);
        bool CheckCourseOfTeacher(int courseID, int teacherID);
        List<Course> getCourseByName(int teacherID, string nameCourse);
        List<Course> getCousreByID(int teacherID, int courseID);

    }
}
