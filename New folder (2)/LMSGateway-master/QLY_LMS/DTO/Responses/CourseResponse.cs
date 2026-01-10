namespace QLY_LMS.DTO.Responses
{
    public class CourseResponse
    {
        public int CourseID { get; set; }
        public string CourseName { get; set; }
        public string CourseType { get; set; }
        public string CourseDes { get; set; }
        public DateTime? CourseDate { get; set; }
        public decimal CoursePrice { get; set; }
        public byte CourseStatus { get; set; }
        public string CourseImage { get; set; }
        public string TeacherName { get; set; }
    }
}
