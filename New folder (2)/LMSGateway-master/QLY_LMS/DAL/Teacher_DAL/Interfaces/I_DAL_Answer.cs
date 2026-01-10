using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.DAL.Teacher_DAL.Interfaces
{
    public interface I_DAL_Answer
    {
        public List<Answer> GetAllAnswer(int questionID, int teacherID);
        public bool CreateAnswer(AnswerRequest answer, int teacherID);
        public bool UpdateAnswer(Answer answer, int teacherID);
        public bool DeleteAnswer(int answerID, int teacherID);
    }
}
