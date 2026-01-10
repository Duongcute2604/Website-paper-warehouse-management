using QLY_LMS.Modal;

namespace ADMIN.DAL.Interfaces
{
    public interface IUserDAL
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
