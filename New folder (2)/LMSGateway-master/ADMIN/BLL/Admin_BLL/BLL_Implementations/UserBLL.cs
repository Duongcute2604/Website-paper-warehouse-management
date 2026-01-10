using ADMIN.DAL.Interfaces;
using QLY_LMS.BLL.Admin_BLL.BLL_Interfaces;
using QLY_LMS.Modal;

namespace QLY_LMS.BLL.Admin_BLL.BLL_Implementations
{
    public class UserBLL : IUserBLL
    {
        private readonly IUserDAL _userDAL;

        public UserBLL(IUserDAL userDAL)
        {
            _userDAL = userDAL;
        }

        public List<User_table> GetAllUsers()
        {
            return _userDAL.GetAllUsers();
        }

        public User_table GetUserById(int id)
        {
            if (id <= 0)
                throw new ArgumentException("ID phải lớn hơn 0", nameof(id));

            var user = _userDAL.GetUserById(id);
            if (user == null)
                throw new KeyNotFoundException($"Không tìm thấy user với ID = {id}");

            return user;
        }

        public bool CreateUser(User_table model)
        {
            ValidateUser(model);

            // Kiểm tra trùng Account hoặc Email (rất quan trọng ở tầng BLL)
            var existingUsers = _userDAL.GetAllUsers();
            if (existingUsers.Any(u => u.Account == model.Account))
                throw new InvalidOperationException("Tài khoản đã tồn tại!");

            if (existingUsers.Any(u => u.Email == model.Email))
                throw new InvalidOperationException("Email đã được sử dụng!");

            return _userDAL.CreateUser(model);
        }

        public bool UpdateUser(User_table model)
        {
            if (model.UserID <= 0)
                throw new ArgumentException("UserID không hợp lệ");

            ValidateUser(model);

            // Kiểm tra tồn tại trước khi update
            var existingUser = _userDAL.GetUserById(model.UserID);
            if (existingUser == null)
                throw new KeyNotFoundException($"Không tìm thấy user với ID = {model.UserID}");

            // Kiểm tra trùng Account/Email (trừ chính nó)
            var allUsers = _userDAL.GetAllUsers();
            if (allUsers.Any(u => u.UserID != model.UserID && u.Account == model.Account))
                throw new InvalidOperationException("Tài khoản đã được sử dụng bởi người khác!");

            if (allUsers.Any(u => u.UserID != model.UserID && u.Email == model.Email))
                throw new InvalidOperationException("Email đã được sử dụng bởi người khác!");

            return _userDAL.UpdateUser(model);
        }

        public bool DeleteUser(int id)
        {
            if (id <= 0)
                throw new ArgumentException("ID không hợp lệ");

            //var user = _userDAL.GetUserById(id);
            //if (user == null)
            //    throw new KeyNotFoundException($"Không tìm thấy user để xóa (ID = {id})");

            // Có thể thêm kiểm tra: không cho xóa admin, hoặc user đang có đơn hàng, v.v.
            // Ví dụ:
            // if (user.RoleID == 1) throw new UnauthorizedAccessException("Không thể xóa tài khoản Admin!");

            return _userDAL.DeleteUser(id);
        }

        public List<User_table> Search(int pageIndex, int pageSize, out long total, string? userName = null, string? district = null)
        {
            if (pageIndex < 1) pageIndex = 1;
            if (pageSize < 1) pageSize = 10;
            if (pageSize > 100) pageSize = 100; // Giới hạn tối đa

            return _userDAL.Search(pageIndex, pageSize, out total, userName ?? "", district ?? "");
        }

        // Hàm validate chung
        private void ValidateUser(User_table model)
        {
            if (model == null)
                throw new ArgumentNullException(nameof(model));

            if (string.IsNullOrWhiteSpace(model.UserName))
                throw new ArgumentException("Tên người dùng không được để trống");

            if (string.IsNullOrWhiteSpace(model.Account))
                throw new ArgumentException("Tài khoản không được để trống");

            if (string.IsNullOrWhiteSpace(model.Pass))
                throw new ArgumentException("Mật khẩu không được để trống");

            if (string.IsNullOrWhiteSpace(model.Email) || !model.Email.Contains("@"))
                throw new ArgumentException("Email không hợp lệ");

            //if (model.DateOfBirth >= DateTime.Now.AddYears(-10))
            //    throw new ArgumentException("Người dùng phải trên 10 tuổi");
        }
    }
}