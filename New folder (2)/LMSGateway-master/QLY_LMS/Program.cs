using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using QLY_LMS.BLL.Teacher_BLL.BLL_Implementations;
using QLY_LMS.BLL.Teacher_BLL.BLL_Interfaces;
using QLY_LMS.DAL.Teacher_DAL.Implementations;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Data;
using System.Text;

namespace QLY_LMS
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // ===== ĐĂNG KÝ JWT AUTH CHO QLY_LMS API =====
            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,

                        ValidIssuer = "lms_api",
                        ValidAudience = "lms_user",
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes("THIS_IS_SUPER_LONG_JWT_SECRET_KEY_1234567890"))   //  PHẢI GIỐNG AuthService + Gateway
                    };
                });

            builder.Services.AddAuthorization();

            // ===== ĐĂNG KÝ SERVICE + DAL =====
            builder.Services.AddScoped<DBConnect>();

            // BLL
            builder.Services.AddScoped<I_BLL_ManageCourse, BLL_ManageCourse>();
            builder.Services.AddScoped<I_BLL_ManageVideoCourse, BLL_ManageVideoCourse>();
            builder.Services.AddScoped<I_BLL_ManageAssignment, BLL_ManageAssignment>();
            builder.Services.AddScoped<I_BLL_ManageStudent, BLL_ManageStudent>();
            builder.Services.AddScoped<I_BLL_Question, BLL_Question>();
            builder.Services.AddScoped<I_BLL_Answer, BLL_Answer>();
            builder.Services.AddScoped<I_BLL_Info, BLL_Info>();
            builder.Services.AddScoped<I_BLL_UpdatePass, BLL_UpdatePass>();
            // DAL
            builder.Services.AddScoped<I_DAL_ManageCourse, DAL_ManageCourse>();
            builder.Services.AddScoped<I_DAL_ManageVideoCourse, DAL_ManageVideoCourse>();
            builder.Services.AddScoped<I_DAL_Assignment, DAL_Assignment>();
            builder.Services.AddScoped<I_DAL_ManageStudent, DAL_ManageStudent>();
            builder.Services.AddScoped<I_DAL_Question, DAL_Question>();
            builder.Services.AddScoped<I_DAL_Answer, DAL_Answer>();
            builder.Services.AddScoped<I_DAL_Info, DAL_Info>();
            builder.Services.AddScoped<I_DAL_UpdatePass, DAL_UpdatePass>();
            // CONTROLLER + SWAGGER
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();
             
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            // ====  BẬT AUTHENTICATION TRƯỚC AUTHORIZATION ====
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseMiddleware<UserContextMiddleware>();
            app.UseMiddleware<TeacherCourseAuthorizationMiddleware>();

            app.MapControllers();

            app.Run();
        }
    }
}
