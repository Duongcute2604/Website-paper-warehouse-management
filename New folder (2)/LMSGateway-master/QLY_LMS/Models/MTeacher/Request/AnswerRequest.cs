using System.Text.Json.Serialization;

namespace QLY_LMS.Models.MTeacher.Request
{
    public class AnswerRequest
    {
        [JsonIgnore]
        public int answerID { get; set; }
        public int questionID { get; set; }
        public string answerText { get; set; }
        public bool isCorrect { get; set; }
        public int answerIndex { get; set; }
    }
}
