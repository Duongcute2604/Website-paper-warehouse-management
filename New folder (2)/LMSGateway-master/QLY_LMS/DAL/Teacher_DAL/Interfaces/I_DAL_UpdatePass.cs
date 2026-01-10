using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.DAL.Teacher_DAL.Interfaces
{
    public interface I_DAL_UpdatePass
    {
        bool UpdateTeacherPass(int teacherID, update_pass update, out string errorMessage);
    }
}
