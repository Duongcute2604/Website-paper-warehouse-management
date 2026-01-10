namespace QLY_LMS.DTO.Requests
{
    public class LoginRequest
    {
        public string Account { get; set; } = null!;
        public string Pass { get; set; } = null!;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; } = null!;
        public string Message { get; set; } = null!;
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public int RoleId { get; set; }
    }
}
