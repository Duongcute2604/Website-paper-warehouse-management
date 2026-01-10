using System.Text.Json.Serialization;

namespace QLY_LMS.Models.MTeacher
{
    public class update_pass
    {
        [JsonIgnore]
        public int teacherID { get; set; }
        public string currentPass { get; set; }
        public string newPass { get; set; }
    }
}
