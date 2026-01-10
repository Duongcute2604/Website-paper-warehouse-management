using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace QLY_LMS.Models.MTeacher
{
    public class Video_course
    {
        //[JsonIgnore]
        public int videoID { get; set; }
        [Required]
        public int courseID { get; set; }

        [Required]
        public string videoName { get; set; }
        [Required]
        public string videoURL { get; set; }
        [Required]
        public string videoProgress { get; set; } = "incomplete";
    }
}
