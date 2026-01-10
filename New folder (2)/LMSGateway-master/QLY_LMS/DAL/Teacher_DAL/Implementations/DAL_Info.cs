using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Data;
using QLY_LMS.Models.MTeacher;
using System.Data.SqlClient;
using System.Data;

namespace QLY_LMS.DAL.Teacher_DAL.Implementations
{
    public class DAL_Info : I_DAL_Info
    {
        private readonly DBConnect _db;
        public DAL_Info(DBConnect db)
        {
            _db = db;
        }

        // LẤY THÔNG TIN GIẢNG VIÊN
        public List<info_teacher> GetInfoTeacher(int teacherID)
        {
            var info = new List<info_teacher>();
            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_get_info", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@teacherID", teacherID);

                    conn.Open();
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        if (rd.Read())
                        {
                            info.Add(new info_teacher
                            {
                                userID = (int)rd["userID"],
                                userName = rd["userName"].ToString(),
                                Date_of_Birth = DateOnly.FromDateTime((DateTime)rd["Date_of_Birth"]),
                                gender = rd["gender"].ToString(),
                                district = rd["district"].ToString(),
                                province = rd["province"].ToString(),
                                phoneNumber = rd["phoneNumber"].ToString(),
                                Email = rd["Email"].ToString()
                            });
                        }
                    }
                }
            }
            return info; 
        }

        // CẬP NHẬT THÔNG TIN GIẢNG VIÊN
        public bool UpdateInfoTeacher(int teacherID, info_teacher model)
        {
            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_update_info", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@teacherID", teacherID);
                    cmd.Parameters.AddWithValue("@userName", model.userName ?? (object)DBNull.Value);
                    cmd.Parameters.AddWithValue("@Date_of_Birth",model.Date_of_Birth.ToDateTime(TimeOnly.MinValue));
                    cmd.Parameters.AddWithValue("@gender", string.IsNullOrEmpty(model.gender) ? (object)DBNull.Value : model.gender);
                    cmd.Parameters.AddWithValue("@district", string.IsNullOrEmpty(model.district) ? (object)DBNull.Value : model.district);
                    cmd.Parameters.AddWithValue("@province", string.IsNullOrEmpty(model.province) ? (object)DBNull.Value : model.province);
                    cmd.Parameters.AddWithValue("@phoneNumber", string.IsNullOrEmpty(model.phoneNumber) ? (object)DBNull.Value : model.phoneNumber);
                    cmd.Parameters.AddWithValue("@Email", model.Email ?? (object)DBNull.Value);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }
        }
    }
}