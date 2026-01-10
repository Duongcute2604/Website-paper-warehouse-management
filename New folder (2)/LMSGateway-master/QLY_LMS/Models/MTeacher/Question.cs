using System.Text.Json.Serialization;

namespace QLY_LMS.Models.MTeacher
{
    public class Question
    {
        //[JsonIgnore]        
        public int questionID { get; set; }
        public int assignmentID { get; set; }
        public string questionType { get; set; }
        public string content { get; set; }
        public string original { get; set; }
        public string rewritten { get; set; }
        public int questionIndex { get; set; }
    }
}
