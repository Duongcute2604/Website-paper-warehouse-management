using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces
{
    public interface I_BLL_UpdatePass
    {
        bool UpdateTeacherPass(int teacherID, update_pass update, out string errorMessage);
    }
}
