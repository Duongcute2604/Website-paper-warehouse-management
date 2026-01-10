using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_Info : I_BLL_Info
    {
        private readonly I_DAL_Info _dal;
        public BLL_Info(I_DAL_Info dal)
        {
            _dal = dal;
        }
        public List<info_teacher> GetInfoTeacher(int teacherID)
        {
            return _dal.GetInfoTeacher(teacherID);
        }
        public bool UpdateInfoTeacher(int teacherID, info_teacher info_Teacher)
        {
            return _dal.UpdateInfoTeacher(teacherID, info_Teacher);
        }
    }
}
