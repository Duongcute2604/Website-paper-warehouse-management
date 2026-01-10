using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_UpdatePass : I_BLL_UpdatePass
    {
        private readonly I_DAL_UpdatePass _Pass;
        public BLL_UpdatePass(I_DAL_UpdatePass pass)
        {
            _Pass = pass;
        }

        public bool UpdateTeacherPass(int teacherID, update_pass update, out string errorMessage)
        {
            return _Pass.UpdateTeacherPass(teacherID, update, out errorMessage);
        }
    }
}
