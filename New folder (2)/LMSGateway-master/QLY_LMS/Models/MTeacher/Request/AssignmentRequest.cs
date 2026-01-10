namespace QLY_LMS.Models.MTeacher.Request
{
    public class AssignmentRequest
    {
        public int videoID { get; set; }

        public string assignmentName { get; set; }

        public string assignmentCourse { get; set; }

        public string assignmentType { get; set; }  // Quiz, Reading, Rewrite

        public DateTime assignmentDeadline { get; set; }

        public int assignmentDuration { get; set; }

        public string assginmentDes { get; set; }

        public string assignmentStatus { get; set; } = "incomplete";
    }

}
