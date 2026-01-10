namespace QLY_LMS.Models.MTeacher
{
    public class Answer
    {
        public int answerID { get; set; }
        public int questionID { get; set; }
        public string answerText { get; set; }
        public bool isCorrect { get; set; }
        public int answerIndex { get; set; }
    }
}
