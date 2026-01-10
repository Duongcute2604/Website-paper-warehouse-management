using QLY_LMS.Models.MTeacher.Request;
using QLY_LMS.Models.MTeacher.Response;

namespace QLY_LMS.DAL.Teacher_DAL.Interfaces
{
    public interface I_DAL_Assignment
    {
        List<Assignment> GetAssignments(int videoID, int teacherID);
        List<Assignment> getAllAssignment(int teacherID);
        List<Assignment> getAssignmentById(int assignmentID, int teacherID);
        bool CreateAssignment(AssignmentRequest req, int teacherID);
        bool UpdateAssignment(Assignment req, int teacherID);
        bool DeleteAssignment(int assignmentID, int teacherID);
    }
}
