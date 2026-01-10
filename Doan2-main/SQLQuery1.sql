CREATE DATABASE LMS;
	GO

	USE LMS;
	GO

	/* ===================== ROLES ===================== */
	CREATE TABLE ROLES(
		roleID INT PRIMARY KEY,  
		roleName NVARCHAR(50) UNIQUE NOT NULL
	);

	/* ===================== USER_TABLE ===================== */
	CREATE TABLE USER_TABLE(
		userID INT IDENTITY(1,1) PRIMARY KEY,
		userName NVARCHAR(50) NOT NULL,
		Date_of_Birth DATE NULL,
		gender NVARCHAR(10) NULL CHECK (gender IN (N'Nam', N'Nữ', N'Khác')),
		district NVARCHAR(20) NULL,
		province NVARCHAR(20) NULL,
		phoneNumber CHAR(10)  NULL CHECK (phoneNumber IS NULL OR (phoneNumber NOT LIKE '%[^0-9]%' AND LEN(phoneNumber) = 10)),
		Email VARCHAR(100) NOT NULL
			CHECK (
				email LIKE '%_@_%._%' AND
				email NOT LIKE '%[^a-zA-Z0-9@._-]%'
			),

		Account VARCHAR(20) NOT NULL,
		Pass VARCHAR(20) NOT NULL,
		roleID INT NOT NULL
	);


	ALTER TABLE USER_TABLE ADD CONSTRAINT FK_USER_ROLE FOREIGN KEY(roleID) REFERENCES ROLES(roleID)
	ON UPDATE CASCADE ON DELETE CASCADE;

	/* ===================== COURSE ===================== */
	CREATE TABLE COURSE (
		courseID INT IDENTITY(1,1) PRIMARY KEY,
		teacherID INT NOT NULL,
		courseName NVARCHAR(50) NOT NULL,
		courseType NVARCHAR(50) NOT NULL,
		courseDes NVARCHAR(200) NOT NULL,
		courseDate DATE NOT NULL,
		coursePrice DECIMAL(10,3) NOT NULL,
		courseStatus NVARCHAR(20) NOT NULL CHECK(courseStatus IN ('completed', 'incomplete')),
		courseImage VARCHAR(255) NULL
	);



	CREATE TABLE TYPE_COURSE
	(
		typeID INT PRIMARY KEY,
		typeName NVARCHAR(50) UNIQUE NOT NULL
	)

	/* ===================== VIDEO_COURSE ===================== */
	CREATE TABLE VIDEO_COURSE(
		videoID INT IDENTITY(1,1) PRIMARY KEY,
		courseID INT NOT NULL,
		videoName NVARCHAR(100) NOT NULL,
		videoURL VARCHAR(255) NOT NULL,
		videoProgress NVARCHAR(50) NOT NULL CHECK (videoProgress IN ('completed', 'incomplete'))
	);

	ALTER TABLE VIDEO_COURSE 
	ADD CONSTRAINT FK_VIDEO_COURSE FOREIGN KEY(courseID)
	REFERENCES COURSE(courseID)
	ON UPDATE CASCADE ON DELETE CASCADE;

	/* ===================== ASSIGNMENT ===================== */
	CREATE TABLE ASSIGNMENT(
		assignmentID INT IDENTITY(1,1) PRIMARY KEY,
		teacherID INT NOT NULL,
		videoID INT NOT NULL,
		assignmentName NVARCHAR(50) NOT NULL,
		assignmentCourse NVARCHAR(50) NOT NULL,
		assignmentType NVARCHAR(20) NOT NULL,
		assignmentDeadline DATETIME,
		assignmentDuration INT NOT NULL,
		assignmentDes NVARCHAR(100) NOT NULL,
		assignmentStatus VARCHAR(20) NOT NULL CHECK (assignmentStatus IN ('completed', 'incomplete'))

	);


	ALTER TABLE ASSIGNMENT 
	ADD CONSTRAINT FK_ASSIGNMENT_TEACHER FOREIGN KEY(teacherID)
	REFERENCES USER_TABLE(userID)
	ON UPDATE CASCADE ON DELETE CASCADE;

	ALTER TABLE ASSIGNMENT 
	ADD CONSTRAINT FK_ASSIGNMENT_COURSE FOREIGN KEY(videoID)
	REFERENCES VIDEO_COURSE(videoID)
	ON UPDATE CASCADE ON DELETE CASCADE;

	/* ===================== QUESTION ===================== */
	CREATE TABLE QUESTION (
		questionID INT IDENTITY(1,1) PRIMARY KEY,
		assignmentID INT NOT NULL,
questionType NVARCHAR(20) NOT NULL CHECK (questionType IN ('Quizz', 'Reading', 'Rewrite')),
		content NVARCHAR(200) NULL,
		original NVARCHAR(200) NULL,
		rewritten NVARCHAR(200) NULL,
		questionIndex INT NOT NULL
	);


	ALTER TABLE QUESTION 
	ADD CONSTRAINT FK_QUESTION_ASSIGNMENT FOREIGN KEY(assignmentID)
	REFERENCES ASSIGNMENT(assignmentID)
	ON UPDATE CASCADE ON DELETE CASCADE;

	/* ===================== ANSWER ===================== */
	CREATE TABLE ANSWER (
		answerID INT IDENTITY(1,1) PRIMARY KEY,
		questionID INT NOT NULL,
		answerText NVARCHAR(200) NOT NULL,
		isCorrect BIT NOT NULL DEFAULT 0,
		answerIndex INT NOT NULL
	);

	ALTER TABLE ANSWER 
	ADD CONSTRAINT FK_ANSWER_QUESTION FOREIGN KEY(questionID)
	REFERENCES QUESTION(questionID)
	ON UPDATE CASCADE ON DELETE CASCADE;

	CREATE TABLE TYPE_ASSIGNMENT(
	typeID INT PRIMARY KEY,
    typeName NVARCHAR(20) NOT NULL UNIQUE
	);

INSERT INTO TYPE_ASSIGNMENT(typeID, typeName) VALUES
(1,'quizz'), (2,'reading'), (3,'rewrite');


CREATE TABLE STUDENT_COURSE (
    userID          INT,
    courseID        INT,
    enrollDate      DATETIME DEFAULT GETDATE(),
    progressPercent DECIMAL(5,2) DEFAULT 0.00,
	isComplete VARCHAR(20) NOT NULL CHECK (isComplete IN ('completed', 'incomplete')),
    completedDate   DATETIME NULL,
    PRIMARY KEY (userID, courseID),
    FOREIGN KEY (userID) REFERENCES USER_TABLE(userID),
    FOREIGN KEY (courseID) REFERENCES COURSE(courseID)
);




--================================================================================================--
--============================================ ĐĂNG NHẬP ==============================================--
--================================================================================================--

-- PROCEDURE ĐĂNG NHẬP
CREATE OR ALTER PROCEDURE sp_login
    @Account VARCHAR(20),
    @Pass VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        u.userID,
        u.userName,
		u.Email,  
        u.roleID,
        r.roleName
    FROM USER_TABLE u
    INNER JOIN ROLES r ON u.roleID = r.roleID
    WHERE u.Account = @Account AND u.Pass = @Pass;
END
GO


--================================================================================================--
--============================================ ADMIN ==============================================--
--================================================================================================--



-- TẠO PROCEDURE
CREATE PROCEDURE sp_user_get_by_id
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
		userID,  
		userName, 
		Date_of_Birth,
		gender,
		district,
		province,
		phoneNumber,
		Email,		
		Account,
		Pass,		
		roleID
    FROM USER_TABLE 
    WHERE userID = @Id;
END
GO

--CREATE USER (ADMIN)
CREATE PROCEDURE sp_user_create
    @userName NVARCHAR(50),
    @Date_of_Birth DATETIME,
    @gender NVARCHAR(10) = NULL,
    @district NVARCHAR(20) = NULL,
    @province NVARCHAR(20) = NULL,
    @phoneNumber CHAR(10),
    @Email VARCHAR(100),
@Account VARCHAR(20),
    @Pass VARCHAR(20),
    @roleID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        INSERT INTO USER_TABLE (
            userName, Date_of_Birth, gender, district, province,
            phoneNumber, Email, Account, Pass, roleID
        ) VALUES (
            @userName, @Date_of_Birth, @gender, @district, @province,
            @phoneNumber, @Email, @Account, @Pass, @roleID
        );

        return 1;
    END TRY
    BEGIN CATCH
        return 0;
    END CATCH
END
GO


--UPDATE USER
CREATE PROCEDURE sp_user_update
    @userID INT,
    @userName NVARCHAR(50),
    @Date_of_Birth DATETIME,
    @gender NVARCHAR(10) = NULL,
    @district NVARCHAR(20) = NULL,
    @province NVARCHAR(20) = NULL,
    @phoneNumber CHAR(10),
    @Email VARCHAR(100),
    @Account VARCHAR(20),
    @Pass VARCHAR(20),
    @roleID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        UPDATE USER_TABLE SET
            userName = @userName,
            Date_of_Birth = @Date_of_Birth,
            gender = @gender,
            district = @district,
            province = @province,
            phoneNumber = @phoneNumber,
            Email = @Email,
            Account = @Account,
            Pass = @Pass,
            roleID = @roleID
        WHERE userID = @userID;

        IF @@ROWCOUNT = 0
            THROW 50001, 'Không tìm thấy user để cập nhật!', 1;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH
END
GO

--DELETE USER
CREATE PROCEDURE sp_user_delete
    @userID INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DELETE FROM USER_TABLE WHERE userID = @userID;
    
    IF @@ROWCOUNT = 0
        THROW 50001, 'Không tìm thấy user để xóa!', 1;
END
GO