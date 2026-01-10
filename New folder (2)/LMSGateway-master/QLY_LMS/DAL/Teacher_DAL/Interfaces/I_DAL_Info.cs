using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.DAL.Teacher_DAL.Interfaces
{
    public interface I_DAL_Info
    {
        List<info_teacher> GetInfoTeacher(int teacherID);
        bool UpdateInfoTeacher(int teacherID, info_teacher info_Teacher);
    }
}
