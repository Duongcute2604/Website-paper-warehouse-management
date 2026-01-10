using QLY_LMS.Data;
using QLY_LMS.Models.MTeacher;
using System.Data.SqlClient;
using System.Data;
using QLY_LMS.DAL.Teacher_DAL.Interfaces;
using QLY_LMS.Models.MTeacher.Request;

namespace QLY_LMS.DAL.Teacher_DAL.Implementations
{
    public class DAL_Answer : I_DAL_Answer
    {
        private readonly DBConnect _db;

        public DAL_Answer(DBConnect db)
        {
            _db = db;
        }

        public List<Answer> GetAllAnswer(int questionID, int teacherID)
        {
            var list = new List<Answer>();
            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_answer_get_by_question", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@questionID", questionID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);

                conn.Open();
                using (var reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        list.Add(new Answer
                        {
                            answerID = reader.GetInt32(reader.GetOrdinal("answerID")),
                            questionID = questionID,
                            answerText = reader["answerText"]?.ToString(),
                            isCorrect = reader.GetBoolean(reader.GetOrdinal("isCorrect")),
                            answerIndex = reader.GetInt32(reader.GetOrdinal("answerIndex"))
                        });
                    }
                }
            }
            return list;
        }

        public bool CreateAnswer(AnswerRequest answer, int teacherID)
        {
            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_answer_create", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@questionID", answer.questionID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);
                cmd.Parameters.AddWithValue("@answerText", answer.answerText);
                cmd.Parameters.AddWithValue("@isCorrect", answer.isCorrect);
                cmd.Parameters.AddWithValue("@answerIndex", answer.answerIndex);

                conn.Open();
                try { cmd.ExecuteNonQuery(); return true; }
                catch (SqlException ex) { throw new Exception(ex.Message); }
            }
        }

        public bool UpdateAnswer(Answer answer, int teacherID)
        {
            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_answer_update", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@answerID", answer.answerID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);
                cmd.Parameters.AddWithValue("@answerText", answer.answerText);
                cmd.Parameters.AddWithValue("@isCorrect", answer.isCorrect);
                cmd.Parameters.AddWithValue("@answerIndex", answer.answerIndex);

                conn.Open();
                try { cmd.ExecuteNonQuery(); return true; }
                catch (SqlException ex) { throw new Exception(ex.Message); }
            }
        }

        public bool DeleteAnswer(int answerID, int teacherID)
        {
            using (var conn = _db.GetConnection())
            using (var cmd = new SqlCommand("tc_answer_delete", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@answerID", answerID);
                cmd.Parameters.AddWithValue("@teacherID", teacherID);

                conn.Open();
                try { cmd.ExecuteNonQuery(); return true; }
                catch (SqlException ex) { throw new Exception(ex.Message); }
            }
        }
    }
}
