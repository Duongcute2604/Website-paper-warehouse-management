using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Data;
using QLY_LMS.Models.MTeacher;
using System.Data.SqlClient;
using System.Data;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.DAL.Teacher_DAL.Implementations
{
    public class DAL_ManageVideoCourse : I_DAL_ManageVideoCourse
    {
        private readonly DBConnect _db;

        public DAL_ManageVideoCourse(DBConnect db)
        {
            _db = db;
        }

        /* ==========================================================
           1. LẤY VIDEO THEO COURSE + CHECK TEACHER OWNED
        ========================================================== */
        public List<Video_course> GetAllVideo(int courseID, int teacherID)
        {
            var videoList = new List<Video_course>();

            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_video_get_by_course", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@courseID", courseID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);

                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        videoList.Add(new Video_course
                        {
                            videoID = reader.GetInt32(reader.GetOrdinal("videoID")),
                            courseID = reader.GetInt32(reader.GetOrdinal("courseID")),
                            videoName = reader.GetString(reader.GetOrdinal("videoName")),
                            videoURL = reader.GetString(reader.GetOrdinal("videoURL")),
                            videoProgress = reader.GetString(reader.GetOrdinal("videoProgress"))
                        });
                    }
                }
            }
            return videoList;
        }

        /* ==========================================================
           2. THÊM VIDEO 
        ========================================================== */
        public bool CreateVideo(create_video video, int teacherID)
        {
            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_video_create", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@courseID", video.courseID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);
                cmd.Parameters.AddWithValue("@videoName", video.videoName);
                cmd.Parameters.AddWithValue("@videoURL", video.videoURL);
                cmd.Parameters.AddWithValue("@videoProgress", video.videoProgress);

                conn.Open();

                try
                {
                    cmd.ExecuteNonQuery();
                    return true;
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        /* ==========================================================
           3. CẬP NHẬT VIDEO 
        ========================================================== */
        public bool UpdateVideo(Video_courseRequest video, int teacherID)
        {
            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_video_update", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@videoID", video.videoID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);
                cmd.Parameters.AddWithValue("@videoName", video.videoName);
                cmd.Parameters.AddWithValue("@videoURL", video.videoURL);
                cmd.Parameters.AddWithValue("@videoProgress", video.videoProgress);

                conn.Open();

                try
                {
                    cmd.ExecuteNonQuery();
                    return true;
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        /* ==========================================================
           4. XÓA VIDEO 
        ========================================================== */
        public bool DeleteVideo(int videoID, int teacherID)
        {
            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_video_delete", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@videoID", videoID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);

                conn.Open();

                try
                {
                    cmd.ExecuteNonQuery();
                    return true;
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }
    }
}
