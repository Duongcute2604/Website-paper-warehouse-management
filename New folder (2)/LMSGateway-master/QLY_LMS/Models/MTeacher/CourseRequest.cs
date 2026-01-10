using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QLY_LMS.Models.MTeacher
{
    public class CourseRequest
    {
        [Required(ErrorMessage = "Tên khóa học không được để trống")]
        [StringLength(50)]
        public string courseName { get; set; } = null!;

        [Required(ErrorMessage = "Loại khóa học không được để trống")]
        [StringLength(50)]
        public string courseType { get; set; } = null!;

        [Required(ErrorMessage = "Mô tả không được để trống")]
        [StringLength(200)]
        public string courseDes { get; set; } = null!;

        [Required]
        public DateOnly courseDate { get; set; }

        [Required]
        [Range(0, 9999999999.999)]
        public decimal coursePrice { get; set; }

        [Required]
        public string courseStatus { get; set; } = "incomplete";

        public string? courseImage { get; set; }
        [JsonIgnore]
        public int teacherID { get; set; }
    }
}
