using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Data.SqlClient;
using System.Security.Claims;
using System.Text;
using AuthService.Models;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config)
    {
        _config = config;
    }

    [HttpPost("login")]
    public IActionResult Login(LoginRequest model)
    {
        using var con = new SqlConnection(_config.GetConnectionString("LMS"));
        con.Open();

        //string sql = @"
        //    SELECT u.userID, u.userName, u.Email, r.roleName
        //    FROM USER_TABLE u
        //    JOIN ROLES r ON u.roleID = r.roleID
        //    WHERE u.Account = @acc AND u.Pass = @pass";

        //var cmd = new SqlCommand(sql, con);
        using var cmd = new SqlCommand("sp_login", con);
        cmd.CommandType = System.Data.CommandType.StoredProcedure;

        cmd.Parameters.AddWithValue("@Account", model.Account);
        cmd.Parameters.AddWithValue("@Pass", model.Pass);

        using var rd = cmd.ExecuteReader();

        if (!rd.Read())
        {
            return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu" });
        }

        int userID = rd.GetInt32(rd.GetOrdinal("userID"));
        string userName = rd.GetString(rd.GetOrdinal("userName"));
        string email = rd.GetString(rd.GetOrdinal("Email"));
        string roleName = rd.GetString(rd.GetOrdinal("roleName"));

        string token = GenerateToken(userID, userName, email, roleName);

        return Ok(new
        {
            accessToken = token,
            role = roleName,
            user = userName
        });
    }

    private string GenerateToken(int userId, string name, string email, string role)
    {
        var jwt = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("userID", userId.ToString()),
            new Claim(ClaimTypes.Name, name),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role)
        };

        var token = new JwtSecurityToken(
            issuer: jwt["Issuer"],
            audience: jwt["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(3),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

