namespace QLY_LMS.Models.MTeacher
{
    public class Student
    {
        // Course
        public int courseID { get; set; }
        public string courseName { get; set; }
        public string courseType { get; set; }
        public string courseStatus { get; set; }

        // Student
        public int studentID { get; set; }
        public string studentName { get; set; }
        public string email { get; set; }
        public string phoneNumber { get; set; }

        // Enrollment
        public DateTime enrollDate { get; set; }
        public decimal progressPercent { get; set; }
        public string isComplete { get; set; }   // completed / incomplete
        public DateTime? completedDate { get; set; }
    }
}
