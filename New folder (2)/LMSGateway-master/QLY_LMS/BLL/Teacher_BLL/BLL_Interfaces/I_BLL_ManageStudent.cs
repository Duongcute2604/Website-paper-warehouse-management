using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces
{
    public interface I_BLL_ManageStudent
    {
        List<Student> getAllStudent(int teacherID);
        List<Student> getAllStudentCourse(int teacherID, int courseID);
    }
}
