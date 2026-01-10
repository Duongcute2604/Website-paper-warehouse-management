using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Data;
using System.Data.SqlClient;
using System.Data;
using QLY_LMS.Models.MTeacher.Request;
using QLY_LMS.Models.MTeacher.Response;

namespace QLY_LMS.DAL.Teacher_DAL.Implementations
{
    public class DAL_Assignment : I_DAL_Assignment
    {
        private readonly DBConnect _db;

        public DAL_Assignment(DBConnect db)
        {
            _db = db;
        }

        public List<Assignment> GetAssignments(int videoID, int teacherID)
        {
            var list = new List<Assignment>();

            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_assignment_get_by_video", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@videoID", videoID);
                    cmd.Parameters.AddWithValue("@teacherID", teacherID);

                    conn.Open();
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            list.Add(new Assignment
                            {
                                assignmentID = (int)rd["assignmentID"],
                                videoID = (int)rd["videoID"],
                                teacherID = (int)rd["teacherID"],
                                assignmentName = rd["assignmentName"].ToString(),
                                assignmentCourse = rd["assignmentCourse"].ToString(),
                                assignmentType = rd["assignmentType"].ToString(),
                                assignmentDeadline = (DateTime)rd["assignmentDeadline"],
                                assignmentDuration = (int)rd["assignmentDuration"],
                                assignmentDes = rd["assignmentDes"].ToString(),
                                assignmentStatus = rd["assignmentStatus"].ToString()
                            });
                        }

                        return list;
                    }
                }
            }     
        }

        public List<Assignment> getAllAssignment(int teacherID)
        {
            var list = new List<Assignment>();

            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_assignment_get_all_assignment", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@teacherID", teacherID);

                    conn.Open();
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            list.Add(new Assignment
                            {
                                assignmentID = (int)rd["assignmentID"],
                                videoID = (int)rd["videoID"],
                                teacherID = (int)rd["teacherID"],
                                assignmentName = rd["assignmentName"].ToString(),
                                assignmentCourse = rd["assignmentCourse"].ToString(),
                                assignmentType = rd["assignmentType"].ToString(),
                                assignmentDeadline = (DateTime)rd["assignmentDeadline"],
                                assignmentDuration = (int)rd["assignmentDuration"],
                                assignmentDes = rd["assignmentDes"].ToString(),
                                assignmentStatus = rd["assignmentStatus"].ToString()
                            });
                        }

                        return list;
                    }
                }
            }
        }

        public List<Assignment> getAssignmentById(int assignmentID, int teacherID)
        {
            var list = new List<Assignment>();

            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_assignment_get_by_id", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@assignmentID", assignmentID);
                    cmd.Parameters.AddWithValue("@teacherID", teacherID);

                    conn.Open();
                    using (SqlDataReader rd = cmd.ExecuteReader())
                    {
                        while (rd.Read())
                        {
                            list.Add(new Assignment
                            {
                                assignmentID = (int)rd["assignmentID"],
                                videoID = (int)rd["videoID"],
                                teacherID = (int)rd["teacherID"],
                                assignmentName = rd["assignmentName"].ToString(),
                                assignmentCourse = rd["assignmentCourse"].ToString(),
                                assignmentType = rd["assignmentType"].ToString(),
                                assignmentDeadline = (DateTime)rd["assignmentDeadline"],
                                assignmentDuration = (int)rd["assignmentDuration"],
                                assignmentDes = rd["assignmentDes"].ToString(),
                                assignmentStatus = rd["assignmentStatus"].ToString()
                            });
                        }

                        return list;
                    }
                }
            }
        }

        public bool CreateAssignment(AssignmentRequest req, int teacherID)
        {
            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_assignment_create", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@teacherID", teacherID);
                    cmd.Parameters.AddWithValue("@videoID", req.videoID);
                    cmd.Parameters.AddWithValue("@assignmentName", req.assignmentName);
                    cmd.Parameters.AddWithValue("@assignmentCourse", req.assignmentCourse);
                    cmd.Parameters.AddWithValue("@assignmentType", req.assignmentType);
                    cmd.Parameters.AddWithValue("@assignmentDeadline", req.assignmentDeadline);
                    cmd.Parameters.AddWithValue("@assignmentDuration", req.assignmentDuration);
                    cmd.Parameters.AddWithValue("@assignmentDes", req.assginmentDes);
                    cmd.Parameters.AddWithValue("@assignmentStatus", req.assignmentStatus?.ToLower() == "completed" ? "completed" : "incomplete");
                    conn.Open();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }
        }
        public bool UpdateAssignment(Assignment req, int teacherID)
        {
            using (SqlConnection conn = _db.GetConnection())
            {
                using (SqlCommand cmd = new SqlCommand("tc_assignment_update", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@assignmentID", req.assignmentID);
                    cmd.Parameters.AddWithValue("@teacherID", teacherID);
                    cmd.Parameters.AddWithValue("@assignmentName", req.assignmentName);
                    cmd.Parameters.AddWithValue("@assignmentCourse", req.assignmentCourse);
                    cmd.Parameters.AddWithValue("@assignmentType", req.assignmentType);
                    cmd.Parameters.AddWithValue("@assignmentDeadline", req.assignmentDeadline);
                    cmd.Parameters.AddWithValue("@assignmentDuration", req.assignmentDuration);
                    cmd.Parameters.AddWithValue("@assignmentDes", req.assignmentDes);
                    cmd.Parameters.AddWithValue("@assignmentStatus", req.assignmentStatus);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }            
        }

        public bool DeleteAssignment(int assignmentID, int teacherID)
        {
            using (var conn = _db.GetConnection())
            {
                using (var cmd = new SqlCommand("tc_assignment_delete", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@assignmentID", assignmentID);
                    cmd.Parameters.AddWithValue("@teacherID", teacherID);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                    return true;
                }
            }            
        }
    }
}
