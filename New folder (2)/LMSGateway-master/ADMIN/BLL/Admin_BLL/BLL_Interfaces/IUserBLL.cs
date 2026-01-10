using QLY_LMS.Modal;

namespace QLY_LMS.BLL.Admin_BLL.BLL_Interfaces
{
    public interface IUserBLL
    {
        List<User_table> GetAllUsers();
        bool CreateUser(User_table model);
        User_table GetUserById(int id);
        bool UpdateUser(User_table model);
        bool DeleteUser(int id);

        List<User_table> Search(
            int pageIndex,
            int pageSize,
            out long total,
            string userName,
            string district
        );
    }
}
