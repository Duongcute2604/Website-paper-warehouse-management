using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces
{
    public interface I_BLL_Info
    {
        List<info_teacher> GetInfoTeacher(int teacherID);
        bool UpdateInfoTeacher(int teacherID, info_teacher info_Teacher);
    }
}
