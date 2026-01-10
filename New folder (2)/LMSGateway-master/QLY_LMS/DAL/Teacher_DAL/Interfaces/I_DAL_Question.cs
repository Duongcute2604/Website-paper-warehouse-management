using QLY_LMS.Models.MTeacher;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.DAL.Teacher_DAL.Interfaces
{
    public interface I_DAL_Question
    {
        List<Question> GetAllQuestion(int assignmentID, int teacherID);
        bool CreateQuestion(QuestionRequest question, int teacherID);
        bool UpdateQuestion(Question question, int teacherID);
        bool DeleteQuestion(int questionID, int teacherID);
    }
}
