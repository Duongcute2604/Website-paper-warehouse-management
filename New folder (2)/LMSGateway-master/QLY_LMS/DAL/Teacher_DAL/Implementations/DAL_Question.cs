using QLY_LMS.Data;
using QLY_LMS.Models.MTeacher;
using System.Data.SqlClient;
using System.Data;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.DAL.Teacher_DAL.Implementations
{
    public class DAL_Question : I_DAL_Question
    {
        private readonly DBConnect _db;

        public DAL_Question(DBConnect db)
        {
            _db = db;
        }
        public List<Question> GetAllQuestion(int assignmentID, int teacherID)
        {
            var list = new List<Question>();
            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_question_get_assignment", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@assignmentID", assignmentID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);

                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new Question
                        {
                            questionID = reader.GetInt32(reader.GetOrdinal("questionID")),
                            assignmentID = assignmentID,
                            questionType = reader.GetString(reader.GetOrdinal("questionType")),
                            content = reader["content"]?.ToString(),
                            original = reader["original"]?.ToString(),
                            rewritten = reader["rewritten"]?.ToString(),
                            questionIndex = reader.GetInt32(reader.GetOrdinal("questionIndex"))
                        });
                    }
                }
            }
            return list;
        }

        public bool CreateQuestion(QuestionRequest question, int teacherID)
        {
            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_question_create", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@assignmentID", question.assignmentID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);
                cmd.Parameters.AddWithValue("@questionType", question.questionType);
                cmd.Parameters.AddWithValue("@content", question.content ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@original", question.original ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@rewritten", question.rewritten ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@questionIndex", question.questionIndex);

                conn.Open();
                try
                {
                    cmd.ExecuteNonQuery();
                    return true;
                }
                catch (SqlException ex) { throw new Exception(ex.Message); }
            }
        }

        public bool UpdateQuestion(Question question, int teacherID)
        {
            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_question_update", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@questionID", question.questionID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);
                cmd.Parameters.AddWithValue("@questionType", question.questionType);
                cmd.Parameters.AddWithValue("@content", question.content ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@original", question.original ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@rewritten", question.rewritten ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@questionIndex", question.questionIndex);

                conn.Open();
                try { cmd.ExecuteNonQuery(); return true; }
                catch (SqlException ex) { throw new Exception(ex.Message); }
            }
        }

        public bool DeleteQuestion(int questionID, int teacherID)
        {
            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_question_delete", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@questionID", questionID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);

                conn.Open();
                try { cmd.ExecuteNonQuery(); return true; }
                catch (SqlException ex) { throw new Exception(ex.Message); }
            }
        }
    }
}
