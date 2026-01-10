using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher.Request;
using QLY_LMS.Models.MTeacher.Response;

namespace QLY_LMS.BLL.Teacher_BLL.BLL_Implementations
{
    public class BLL_ManageAssignment: I_BLL_ManageAssignment
    {
        private readonly I_DAL_Assignment _dal;

        public BLL_ManageAssignment(I_DAL_Assignment dal)
        {
            _dal = dal;
        }

        public List<Assignment> GetAssignments(int videoID, int teacherID)
        {
            return _dal.GetAssignments(videoID, teacherID);
        }

        public List<Assignment> getAllAssignment(int teacherID)
        {
            return _dal.getAllAssignment(teacherID);
        }

        public List<Assignment> getAssignmentById(int assignmentID, int teacherID)
        {
            return _dal.getAssignmentById(assignmentID, teacherID);
        }

        public bool CreateAssignment(AssignmentRequest req, int teacherID)
        {
            return _dal.CreateAssignment(req, teacherID);
        }

        public bool UpdateAssignment(Assignment req, int teacherID)
        {
            return _dal.UpdateAssignment(req, teacherID);
        }
        public bool DeleteAssignment(int assignmentID, int teacherID)
        {
            return _dal.DeleteAssignment(assignmentID, teacherID);
        }
    }
}
