using QLY_LMS.Data;
using QLY_LMS.Models.MTeacher;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using System.Data.SqlClient;
using System.Data;
using QLY_LMS.Controllers.Teacher_Controllers;
using System.Reflection;

namespace QLY_LMS.DAL.Teacher_DAL.Implementations
{
    public class DAL_ManageCourse : I_DAL_ManageCourse
    {
        private readonly DBConnect _db;

        public DAL_ManageCourse(DBConnect db)
        {
            _db = db;
        }  

        public List<Course> getAllCoures(int TId)
        {
            var courseList = new List<Course>();

            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_course_getAll_by_id", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@TId", TId);

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            courseList.Add(new Course
                            {
                                courseID = reader.GetInt32("courseID"),  
                                courseName = reader.GetString("courseName"),
                                courseType = reader.GetString("courseType"),
                                courseDes = reader.GetString("courseDes"), 
                                courseDate = reader["courseDate"] == DBNull.Value
                                    ? default
                                    : DateOnly.FromDateTime(reader.GetDateTime("courseDate")),
                                coursePrice = reader.GetDecimal("coursePrice"),
                                courseStatus = reader.GetString("courseStatus"),
                                courseImage = reader.IsDBNull("courseImage") ? null : reader.GetString("courseImage"),
                                teacherID = reader.GetInt32("teacherID")
                            });
                        }
                    }
                }
            }
            return courseList;
        }

        public bool createCourse(CourseRequest course)
        {
            using (var conn = _db.GetConnection())
            {
                using (var cmd = new SqlCommand("tc_course_create", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@courseName", course.courseName);
                    cmd.Parameters.AddWithValue("@courseType", course.courseType);
                    cmd.Parameters.AddWithValue("@courseDes", course.courseDes);
                    cmd.Parameters.AddWithValue("@courseDate", DateTime.Now);
                    cmd.Parameters.Add("@coursePrice", SqlDbType.Decimal).Value = course.coursePrice;
                    cmd.Parameters["@coursePrice"].Precision = 10;
                    cmd.Parameters["@coursePrice"].Scale = 3;
                    cmd.Parameters.AddWithValue("@courseStatus", course.courseStatus?.ToLower() == "completed" ? "completed" : "incomplete");
                    cmd.Parameters.AddWithValue("@courseImage", (object)course.courseImage ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@teacherID", course.teacherID);

                    conn.Open();
                    cmd.ExecuteNonQuery();

                    return true;
                }
            }
        }

        public bool updateCourse(int courseID, Course model)
        {
            using (SqlConnection conn = _db.GetConnection())
            {
                conn.Open();
                using (SqlCommand cmd = new SqlCommand("tc_course_update", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@courseID", courseID);
                    cmd.Parameters.AddWithValue("@courseName", model.courseName);
                    cmd.Parameters.AddWithValue("@courseType", model.courseType);
                    cmd.Parameters.AddWithValue("@courseDes", model.courseDes);
                    cmd.Parameters.AddWithValue("@courseDate", model.courseDate.ToDateTime(TimeOnly.MinValue));
                    cmd.Parameters.AddWithValue("@coursePrice", model.coursePrice);
                    cmd.Parameters.AddWithValue("@courseStatus", model.courseStatus);
                    cmd.Parameters.AddWithValue("@courseImage", model.courseImage);
                    cmd.Parameters.AddWithValue("@teacherID", model.teacherID);

                    cmd.ExecuteNonQuery();
                    return true;
                }
            }
        }


        public bool deleteCourse(int courseID, int teacherID)
        {
            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_course_delete", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@courseID", courseID);
                    cmd.Parameters.AddWithValue("@teacherID", teacherID);
                    conn.Open();
                    var result = cmd.ExecuteNonQuery();
                    return true;
                }
                
            }
        }

        public List<Course> getCourseByName(int teacherID, string nameCourse)
        {
            var courseList = new List<Course>();

            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_course_search_by_name", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@teacherID", teacherID);

                    // Nếu searchTerm rỗng hoặc null → truyền NULL để procedure trả tất cả
                    if (string.IsNullOrWhiteSpace(nameCourse))
                    {
                        cmd.Parameters.AddWithValue("@searchName", DBNull.Value);
                    }
                    else
                    {
                        cmd.Parameters.AddWithValue("@searchName", nameCourse.Trim());
                    }

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            courseList.Add(new Course
                            {
                                courseID = reader.GetInt32("courseID"),
                                courseName = reader.GetString("courseName"),
                                courseType = reader.GetString("courseType"),
                                courseDes = reader.GetString("courseDes"),
                                courseDate = reader["courseDate"] == DBNull.Value
                                    ? default
                                    : DateOnly.FromDateTime(reader.GetDateTime("courseDate")),
                                coursePrice = reader.GetDecimal("coursePrice"),
                                courseStatus = reader.GetString("courseStatus"),
                                courseImage = reader.IsDBNull("courseImage") ? null : reader.GetString("courseImage")
                            });
                        }
                    }
                }
            }

            return courseList;
        }

        public List<Course> getCourseByID(int teacherID, int courseID)
        {
            var course = new List<Course>();
            using (SqlConnection con = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_course_get_by_id", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure; 
                    cmd.Parameters.AddWithValue("@teacherID", teacherID);
                    cmd.Parameters.AddWithValue("@courseID", courseID);
                    con.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            course.Add(new Course
                            {
                                courseID = reader.GetInt32("courseID"),
                                courseName = reader.GetString("courseName"),
                                courseType = reader.GetString("courseType"),
                                courseDes = reader.GetString("courseDes"),
                                courseDate = reader["courseDate"] == DBNull.Value
                                    ? default
                                    : DateOnly.FromDateTime(reader.GetDateTime("courseDate")),
                                coursePrice = reader.GetDecimal("coursePrice"),
                                courseStatus = reader.GetString("courseStatus"),
                                courseImage = reader.IsDBNull("courseImage") ? null : reader.GetString("courseImage")
                            });
                        }
                    }
                }
            }
            return course;
        }



        public bool CheckCourseOfTeacher(int courseID, int teacherID)
        {
            using (var con = _db.GetConnection())
            {
                con.Open();
                string sql = @"
            SELECT COUNT(*) 
            FROM COURSE 
            WHERE courseID = @courseID AND teacherID = @teacherID";

                using (var cmd = new SqlCommand(sql, con))
                {
                    cmd.Parameters.AddWithValue("@courseID", courseID);
                    cmd.Parameters.AddWithValue("@teacherID", teacherID);

                    int count = (int)cmd.ExecuteScalar();
                    return count > 0;
                }
            }
        }

    }
}
