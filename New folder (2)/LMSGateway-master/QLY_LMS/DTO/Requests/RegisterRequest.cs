namespace QLY_LMS.DTO.Requests
{
    public class RegisterRequest
    {
        public string UserName { get; set; }
        public string Account { get; set; }
        public string Pass { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public DateTime Date_of_Birth { get; set; }
    }
}
