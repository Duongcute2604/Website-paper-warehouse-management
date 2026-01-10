using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_ManageStudent : I_BLL_ManageStudent
    {
        private readonly I_DAL_ManageStudent _dal_ManageStudent;
        public BLL_ManageStudent(I_DAL_ManageStudent dal_manageStudent)
        {
            _dal_ManageStudent = dal_manageStudent; 
        }

        public List<Student> getAllStudent(int teacherID)
        {
            return _dal_ManageStudent.getAllStudent(teacherID);
        }

        public List<Student> getAllStudentCourse(int teacherID, int courseID)
        {
            return _dal_ManageStudent.getAllStudentCourse(teacherID, courseID);
        }
    }
}
