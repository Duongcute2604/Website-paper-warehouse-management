//using ADMIN.DAL.Interfaces;
//using ADMIN.Data;
//using QLY_LMS.Modal;
//using System.Data;
//using System.Data.SqlClient;
//using System.Linq;


//namespace ADMIN.DAL.Implementations
//{
//    public partial class UserDAL : IUserDAL
//    {
//        private readonly DBConnect _db;

//        public UserDAL(DBConnect db)
//        {
//            _db = db;
//        }

//        public List<User_table> GetAllUsers()
//        {
//            var users = new List<User_table>();
//            string sql = "SELECT * FROM USER_TABLE";

//            using (SqlConnection conn = _db.GetConnection())
//            {
//                SqlCommand cmd = new SqlCommand(sql, conn);
//                conn.Open();
//                SqlDataReader reader = cmd.ExecuteReader();

//                while (reader.Read())  // ← DÙNG WHILE, KHÔNG DÙNG IF!!!
//                {
//                    users.Add(new User_table
//                    {
//                        UserID = (int)reader["userID"],
//                        UserName = reader["userName"].ToString(),
//                        DateOfBirth = (DateTime)reader["Date_of_Birth"],
//                        District = reader["district"].ToString(),
//                        Province = reader["province"].ToString(),
//                        PhoneNumber = reader["phoneNumber"].ToString(),
//                        Email = reader["Email"].ToString(),
//                        Account = reader["Account"].ToString(),
//                        Pass = reader["Pass"].ToString(),
//                        RoleID = (int)reader["roleID"],
//                    });
//                }
//            }
//            return users;
//        }

//        public bool CreateUser(User_table model)
//        {
//            string msgError = "";
//            try
//            {
//                using (SqlConnection conn = _db.GetConnection())
//                {
//                    SqlCommand cmd = new SqlCommand("sp_user_create", conn);
//                    cmd.CommandType = CommandType.StoredProcedure;

//                    cmd.Parameters.AddWithValue("@userName", model.UserName);
//                    cmd.Parameters.AddWithValue("@Date_of_Birth", model.DateOfBirth);
//                    cmd.Parameters.AddWithValue("@district", model.District);
//                    cmd.Parameters.AddWithValue("@province", model.Province);
//                    cmd.Parameters.AddWithValue("@phoneNumber", model.PhoneNumber);
//                    cmd.Parameters.AddWithValue("@Email", model.Email);
//                    cmd.Parameters.AddWithValue("@Account", model.Account);
//                    cmd.Parameters.AddWithValue("@Pass", model.Pass);
//                    cmd.Parameters.AddWithValue("@roleID", model.RoleID);

//                    conn.Open();
//                    var result = cmd.ExecuteNonQuery();

//                    return true;
//                }
//            }
//            catch (Exception ex)
//            {
//                throw ex;
//            }
//        }


//        public User_table GetUserById(int id)
//        {
//            try
//            {
//                using (SqlConnection conn = _db.GetConnection())
//                {
//                    SqlCommand cmd = new SqlCommand("sp_user_get_by_id", conn);
//                    cmd.CommandType = CommandType.StoredProcedure;
//                    cmd.Parameters.AddWithValue("@Id", id);
//                    conn.Open();
//                    SqlDataReader reader = cmd.ExecuteReader();
//                    if (reader.Read())
//                    {
//                        return new User_table
//                        {
//                            UserID = (int)reader["userID"],
//                            UserName = reader["userName"].ToString(),
//                            DateOfBirth = (DateTime)reader["Date_of_Birth"],
//                            District = reader["district"].ToString(),
//                            Province = reader["province"].ToString(),
//                            PhoneNumber = reader["phoneNumber"].ToString(),
//                            Email = reader["Email"].ToString(),
//                            Account = reader["Account"].ToString(),
//                            Pass = reader["Pass"].ToString(),
//                            RoleID = (int)reader["roleID"],
//                        };
//                    }
//                    return null;
//                }
//            }
//            catch (Exception ex)
//            {
//                throw ex;
//            }
//        }


//        public bool UpdateUser(User_table model)
//        {
//            string msgError = "";
//            try
//            {
//                using (SqlConnection conn = _db.GetConnection())
//                {
//                    SqlCommand cmd = new SqlCommand("sp_user_update", conn);
//                    cmd.CommandType = CommandType.StoredProcedure;

//                    cmd.Parameters.AddWithValue("@userID", model.UserID);
//                    cmd.Parameters.AddWithValue("@userName", model.UserName);
//                    cmd.Parameters.AddWithValue("@Date_of_Birth", model.DateOfBirth);
//                    cmd.Parameters.AddWithValue("@district", model.District);
//                    cmd.Parameters.AddWithValue("@province", model.Province);
//                    cmd.Parameters.AddWithValue("@phoneNumber", model.PhoneNumber);
//                    cmd.Parameters.AddWithValue("@Email", model.Email);
//                    cmd.Parameters.AddWithValue("@Account", model.Account);
//                    cmd.Parameters.AddWithValue("@Pass", model.Pass);
//                    cmd.Parameters.AddWithValue("@roleID", model.RoleID);

//                    conn.Open();
//                    var result = cmd.ExecuteNonQuery();

//                    return true;
//                }
//            }
//            catch (Exception ex)
//            {
//                throw ex;
//            }
//        }


//        public bool DeleteUser(int id)
//        {
//            try
//            {
//                using (SqlConnection conn = _db.GetConnection())
//                {
//                    SqlCommand cmd = new SqlCommand("sp_user_delete", conn);
//                    cmd.CommandType = CommandType.StoredProcedure;

//                    cmd.Parameters.AddWithValue("@userID", id);

//                    conn.Open();
//                    var result = cmd.ExecuteNonQuery();

//                    return true;
//                }
//            }
//            catch (Exception ex)
//            {
//                throw ex;
//            }
//        }


//        public List<User_table> Search(
//            int pageIndex,
//            int pageSize,
//            out long total,
//            string userName,
//            string district)
//        {
//            total = 0;
//            try
//            {
//                using (SqlConnection conn = _db.GetConnection())
//                {
//                    SqlCommand cmd = new SqlCommand("sp_user_search", conn);
//                    cmd.CommandType = CommandType.StoredProcedure;

//                    cmd.Parameters.AddWithValue("@page_index", pageIndex);
//                    cmd.Parameters.AddWithValue("@page_size", pageSize);
//                    cmd.Parameters.AddWithValue("@userName", userName);
//                    cmd.Parameters.AddWithValue("@district", district);

//                    conn.Open();
//                    SqlDataReader reader = cmd.ExecuteReader();

//                    var list = new List<User_table>();

//                    while (reader.Read())
//                    {
//                        if (total == 0)
//                            total = (long)reader["RecordCount"];

//                        list.Add(new User_table
//                        {
//                            UserID = (int)reader["userID"],
//                            UserName = reader["userName"].ToString(),
//                            Email = reader["Email"].ToString(),
//                            District = reader["district"].ToString(),
//                            Province = reader["province"].ToString(),
//                            PhoneNumber = reader["phoneNumber"].ToString(),
//                        });
//                    }

//                    return list;
//                }
//            }
//            catch (Exception ex)
//            {
//                throw ex;
//            }
//        }
//    }
//}
