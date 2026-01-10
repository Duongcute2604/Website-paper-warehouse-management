using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Data;
using QLY_LMS.Models.MTeacher;
using System.Data;
using System.Data.SqlClient;
using System.Reflection.PortableExecutable;

namespace QLY_LMS.DAL.Teacher_DAL.Implementations
{
    public class DAL_ManageStudent: I_DAL_ManageStudent
    {
        private readonly DBConnect _db;

        public DAL_ManageStudent(DBConnect db)
        {
            _db = db;
        }

        public List<Student> getAllStudent(int teacherID)
        {
            var students = new List<Student>();
            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_get_all_students_of_teacher", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("teacherID", teacherID);
                    conn.Open();
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            students.Add(new Student
                            {
                                courseID = rd.GetInt32("courseID"),
                                courseName = rd.GetString("courseName"),
                                courseType = rd.GetString("courseType"),
                                courseStatus = rd.GetString("courseStatus"),
                                studentID = rd.GetInt32("studentID"),
                                studentName = rd.GetString("studentName"),
                                email = rd.GetString("email"),
                                phoneNumber = rd.GetString("phoneNumber"),
                                enrollDate = rd.GetDateTime(rd.GetOrdinal("enrollDate")),
                                progressPercent = rd.IsDBNull(rd.GetOrdinal("progressPercent")) ? 0
                                                : rd.GetDecimal(rd.GetOrdinal("progressPercent")),

                                isComplete = rd.GetString("isComplete"),
                                completedDate = rd.IsDBNull(rd.GetOrdinal("completedDate"))
                                                ? (DateTime?)null
                                                : rd.GetDateTime(rd.GetOrdinal("completedDate"))
                            });
                        }
                    }
                }
            }

            return students;
        }

        public List<Student> getAllStudentCourse(int teacherID, int courseID)
        {
            var students = new List<Student>();
            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_get_students_by_teacher_and_course", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("teacherID", teacherID);
                    cmd.Parameters.AddWithValue("courseID", courseID);
                    conn.Open();
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            students.Add(new Student
                            {
                                courseID = rd.GetInt32("courseID"),
                                courseName = rd.GetString("courseName"),
                                courseType = rd.GetString("courseType"),
                                courseStatus = rd.GetString("courseStatus"),
                                studentID = rd.GetInt32("studentID"),
                                studentName = rd.GetString("studentName"),
                                email = rd.GetString("email"),
                                phoneNumber = rd.GetString("phoneNumber"),
                                enrollDate = rd.GetDateTime(rd.GetOrdinal("enrollDate")),
                                progressPercent = rd.IsDBNull(rd.GetOrdinal("progressPercent")) ? 0
                                                : rd.GetDecimal(rd.GetOrdinal("progressPercent")),

                                isComplete = rd.GetString("isComplete"),
                                completedDate = rd.IsDBNull(rd.GetOrdinal("completedDate"))
                                                ? (DateTime?)null
                                                : rd.GetDateTime(rd.GetOrdinal("completedDate"))
                            });
                        }
                    }
                }
            }

            return students;
        }

    }
}
