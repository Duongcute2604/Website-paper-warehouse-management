using System.Text.Json.Serialization;

namespace QLY_LMS.Models.MTeacher.Response
{
    public class Assignment
    {
        //[JsonIgnore]
        public int assignmentID { get; set; }
        public int videoID { get; set; }
        [JsonIgnore]
        public int teacherID { get; set; }
        public string assignmentName { get; set; }
        public string assignmentCourse { get; set; }
        public string assignmentType { get; set; }
        public DateTime? assignmentDeadline { get; set; }
        public int assignmentDuration { get; set; }
        public string assignmentDes { get; set; }
        public string assignmentStatus { get; set; } = "incomplete";
    }
}
