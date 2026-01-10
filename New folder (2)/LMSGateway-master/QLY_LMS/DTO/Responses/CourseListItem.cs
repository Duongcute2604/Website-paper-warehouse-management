namespace QLY_LMS.DTO.Responses
{
    public class CourseListItem
    {
        public int CourseID { get; set; }
        public string CourseName { get; set; }
        public string CourseType { get; set; }
        public decimal CoursePrice { get; set; }
        public string CourseImage { get; set; }
        public string TeacherName { get; set; }
    }
}
