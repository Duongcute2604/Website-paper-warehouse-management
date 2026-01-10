using System.Text.Json.Serialization;

namespace QLY_LMS.Models.MTeacher
{
    public class info_teacher
    {
        [JsonIgnore]
        public int userID { get; set; }
        public string userName { get; set; } = null!;
        public DateOnly Date_of_Birth { get; set; }
        public string gender { get; set; } = null!;
        public string district { get; set; } = null!;
        public string province { get; set; } = null!;
        public string phoneNumber { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
}
