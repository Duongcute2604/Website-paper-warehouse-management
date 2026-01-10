
//Chứa các lớp ánh xạ với bảng trong database.
using System.ComponentModel.DataAnnotations;

namespace QLY_LMS.Model
{
    public class Role
    {
        public int RoleID { get; set; }
        [Required]
        public string RoleName { get; set; }
    }

}
