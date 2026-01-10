using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.DAL.Teacher_DAL.Interfaces
{
    public interface I_DAL_ManageStudent
    {
        List<Student> getAllStudent(int teacherID);
        List<Student> getAllStudentCourse(int teacherID, int courseID);
    }
}
