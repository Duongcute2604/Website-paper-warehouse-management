CREATE DATABASE LMS_ADMIN;
	GO

	USE LMS_ADMIN;
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
		gender NVARCHAR(10) NULL CHECK (gender IN (N'Nam', N'N?', N'Khác')),
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
--============================================ ??NG NH?P ==============================================--
--================================================================================================--

-- PROCEDURE ??NG NH?P
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



-- T?O PROCEDURE
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
            THROW 50001, 'Không tìm th?y user ?? c?p nh?t!', 1;
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
        THROW 50001, 'Không tìm th?y user ?? xóa!', 1;
END
GO
	INSERT INTO ROLES(roleID, roleName) VALUES
(1, N'Admin'),
(2, N'Giáo viên'),
(3, N'Học viên');
INSERT INTO USER_TABLE(userName, Date_of_Birth, gender, district, province, phoneNumber, Email, Account, Pass, roleID)
VALUES
(N'Nguyễn Văn A', '1995-01-01', N'Nam', N'Cầu Giấy', N'Hà Nội', '0912345678', 'vana@example.com', 'vana', '123456', 1),
(N'Trần Thị B', '1996-02-02', N'Nữ', N'Đống Đa', N'Hà Nội', '0923456789', 'thib@example.com', 'thib', '123456', 2),
(N'Lê Văn C', '1997-03-03', N'Nam', N'Hải Châu', N'Đà Nẵng', '0934567890', 'vanc@example.com', 'vanc', '123456', 3),
(N'Phạm Thị D', '1998-04-04', N'Nữ', N'Liên Chiểu', N'Đà Nẵng', '0945678901', 'thid@example.com', 'thid', '123456', 3),
(N'Hoàng Văn E', '1999-05-05', N'Nam', N'Quận 1', N'TP.HCM', '0956789012', 'vane@example.com', 'vane', '123456', 2),
(N'Đỗ Thị F', '2000-06-06', N'Nữ', N'Quận 3', N'TP.HCM', '0967890123', 'thif@example.com', 'thif', '123456', 3),
(N'Ngô Văn G', '1994-07-07', N'Nam', N'Bình Thạnh', N'TP.HCM', '0978901234', 'vang@example.com', 'vang', '123456', 1),
(N'Bùi Thị H', '1993-08-08', N'Nữ', N'Thanh Xuân', N'Hà Nội', '0989012345', 'thih@example.com', 'thih', '123456', 2),
(N'Vũ Văn I', '1992-09-09', N'Nam', N'Hồng Bàng', N'Hải Phòng', '0990123456', 'vani@example.com', 'vani', '123456', 3),
(N'Nguyễn Thị K', '1991-10-10', N'Nữ', N'Lê Chân', N'Hải Phòng', '0901234567', 'thik@example.com', 'thik', '123456', 3);
   SELECT * FROM USER_TABLE;

CREATE PROCEDURE sp_course_create
    @teacherID INT,
    @courseName NVARCHAR(50),
    @courseType NVARCHAR(50),
    @courseDes NVARCHAR(200),
    @courseDate DATE,
    @coursePrice DECIMAL(10,3),
    @courseStatus NVARCHAR(20),
    @courseImage VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO COURSE (
        teacherID, courseName, courseType, courseDes,
        courseDate, coursePrice, courseStatus, courseImage
    ) VALUES (
        @teacherID, @courseName, @courseType, @courseDes,
        @courseDate, @coursePrice, @courseStatus, @courseImage
    );
END
GO

INSERT INTO COURSE (teacherID, courseName, courseType, courseDes, courseDate, coursePrice, courseStatus, courseImage)
VALUES
(1, N'Lập trình C# cơ bản', N'Online', N'Khóa học nhập môn C# cho người mới bắt đầu', '2026-01-15', 499000, N'active', 'csharp.jpg'),
(2, N'Java nâng cao', N'Offline', N'Khóa học Java nâng cao cho lập trình viên', '2026-02-01', 799000, N'active', 'java.jpg'),
(3, N'Python cho Data Science', N'Online', N'Khóa học Python ứng dụng trong phân tích dữ liệu', '2026-03-10', 999000, N'active', 'python.jpg'),
(1, N'ASP.NET Core Web API', N'Online', N'Xây dựng API với ASP.NET Core', '2026-04-05', 599000, N'active', 'aspnet.jpg'),
(2, N'HTML, CSS, JS cơ bản', N'Offline', N'Khóa học front-end cho người mới', '2026-05-20', 399000, N'active', 'frontend.jpg'),
(3, N'SQL Server từ A-Z', N'Online', N'Khóa học quản trị và truy vấn SQL Server', '2026-06-15', 699000, N'active', 'sql.jpg'),
(1, N'Lập trình hướng đối tượng với Java', N'Online', N'Khóa học OOP với Java', '2026-07-01', 499000, N'active', 'oopjava.jpg'),
(2, N'Phân tích thuật toán', N'Offline', N'Khóa học về cấu trúc dữ liệu và giải thuật', '2026-08-12', 899000, N'active', 'algorithm.jpg'),
(3, N'Node.js và Express', N'Online', N'Xây dựng backend với Node.js', '2026-09-05', 799000, N'active', 'nodejs.jpg'),
(1, N'ReactJS cơ bản', N'Online', N'Khóa học front-end với ReactJS', '2026-10-10', 699000, N'active', 'react.jpg');
SELECT * FROM COURSE;

-- ======================= XÓA THỦ TỤC CŨ =======================
IF OBJECT_ID('sp_course_get_all', 'P') IS NOT NULL
    DROP PROCEDURE sp_course_get_all;
IF OBJECT_ID('sp_course_get_by_id', 'P') IS NOT NULL
    DROP PROCEDURE sp_course_get_by_id;
IF OBJECT_ID('sp_course_create', 'P') IS NOT NULL
    DROP PROCEDURE sp_course_create;
IF OBJECT_ID('sp_course_update', 'P') IS NOT NULL
    DROP PROCEDURE sp_course_update;
IF OBJECT_ID('sp_course_delete', 'P') IS NOT NULL
    DROP PROCEDURE sp_course_delete;
GO
SELECT courseSDate, courseEDate FROM COURSE
SELECT TOP 1 * FROM COURSE

-- ======================= THỦ TỤC MỚI =======================

-- Lấy danh sách khóa học
CREATE OR ALTER PROCEDURE sp_course_get_all
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        courseID,
        teacherID,
        courseName,
        courseType,
        courseDes,
        courseSDate,
        courseEDate,
        coursePrice,
        courseStatus,
        courseImage
    FROM COURSE;
END
GO

-- Lấy khóa học theo ID
CREATE OR ALTER PROCEDURE sp_course_get_by_id
    @courseID INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        courseID,
        teacherID,
        courseName,
        courseType,
        courseDes,
        courseSDate,
        courseEDate,
        coursePrice,
        courseStatus,
        courseImage
    FROM COURSE
    WHERE courseID = @courseID;
END
GO

-- Thêm khóa học
CREATE OR ALTER PROCEDURE sp_course_create
    @teacherID INT,
    @courseName NVARCHAR(100),
    @courseType NVARCHAR(50),
    @courseDes NVARCHAR(255),
    @courseSDate DATE,
    @courseEDate DATE,
    @coursePrice DECIMAL(10,2),
    @courseStatus NVARCHAR(50),
    @courseImage NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO COURSE (
        teacherID, courseName, courseType, courseDes,
        courseSDate, courseEDate, coursePrice, courseStatus, courseImage
    )
    VALUES (
        @teacherID, @courseName, @courseType, @courseDes,
        @courseSDate, @courseEDate, @coursePrice, @courseStatus, @courseImage
    );
END
GO

-- Cập nhật khóa học
CREATE OR ALTER PROCEDURE sp_course_update
    @courseID INT,
    @teacherID INT,
    @courseName NVARCHAR(100),
    @courseType NVARCHAR(50),
    @courseDes NVARCHAR(255),
    @courseSDate DATE,
    @courseEDate DATE,
    @coursePrice DECIMAL(10,2),
    @courseStatus NVARCHAR(50),
    @courseImage NVARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE COURSE SET
        teacherID = @teacherID,
        courseName = @courseName,
        courseType = @courseType,
        courseDes = @courseDes,
        courseSDate = @courseSDate,
        courseEDate = @courseEDate,
        coursePrice = @coursePrice,
        courseStatus = @courseStatus,
        courseImage = @courseImage
    WHERE courseID = @courseID;

    IF @@ROWCOUNT = 0
        THROW 50001, N'Không tìm thấy khóa học để cập nhật!', 1;
END
GO

-- Xóa khóa học
CREATE OR ALTER PROCEDURE sp_course_delete
    @courseID INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM COURSE WHERE courseID = @courseID;

    IF @@ROWCOUNT = 0
        THROW 50001, N'Không tìm thấy khóa học để xóa!', 1;
END
GO


ALTER TABLE COURSE ADD CONSTRAINT CK_COURSE_courseStatus
CHECK (courseStatus IN ('active', 'completed', 'incomplete', 'draft', 'archived'));

ALTER TABLE COURSE DROP CONSTRAINT CK_COURSE_courseStatus;

EXEC sp_course_get_all;
SELECT * FROM COURSE;


---doanh thu
--sp_revenue_get_all

-- Xóa bảng cũ nếu tồn tại
IF OBJECT_ID('dbo.REVENUE', 'U') IS NOT NULL
    DROP TABLE dbo.REVENUE;
GO

-- Tạo lại bảng mới với đầy đủ cột giao dịch
CREATE TABLE REVENUE (
    RevenueID INT IDENTITY(1,1) PRIMARY KEY,       -- Mã giao dịch
    StudentName NVARCHAR(100) NOT NULL,            -- Học viên
    CourseName NVARCHAR(100) NOT NULL,             -- Khóa học
    Amount DECIMAL(18,2) NOT NULL,                 -- Số tiền
    PaymentMethod NVARCHAR(50) NOT NULL,           -- Phương thức thanh toán
    PaymentDate DATE NOT NULL,                     -- Ngày thanh toán
    Status NVARCHAR(50) NOT NULL                   -- Trạng thái
);
GO

-- Thêm 10 dữ liệu mẫu
INSERT INTO REVENUE (StudentName, CourseName, Amount, PaymentMethod, PaymentDate, Status)
VALUES
(N'Nguyễn Văn A', N'IELTS', 1500000, N'Chuyển khoản', '2025-10-10', N'Đã thanh toán'),
(N'Trần Thị B', N'TOEIC', 1200000, N'Tiền mặt', '2025-10-11', N'Chưa thanh toán'),
(N'Lê Minh C', N'IELTS', 2000000, N'Ví Momo', '2025-10-12', N'Chờ xác nhận'),
(N'Phạm Hồng D', N'Cơ bản tiếng Anh', 1000000, N'Chuyển khoản', '2025-10-13', N'Đã thanh toán'),
(N'Vũ Thị E', N'TOEIC', 1300000, N'Tiền mặt', '2025-10-14', N'Đã thanh toán'),
(N'Đặng Văn F', N'IELTS', 1800000, N'Ví Momo', '2025-10-15', N'Chưa thanh toán'),
(N'Hồ Thị G', N'Cơ bản tiếng Anh', 1100000, N'Chuyển khoản', '2025-10-16', N'Chờ xác nhận'),
(N'Nguyễn Văn H', N'TOEIC', 1250000, N'Tiền mặt', '2025-10-17', N'Đã thanh toán'),
(N'Trần Thị I', N'IELTS', 1750000, N'Ví Momo', '2025-10-18', N'Chưa thanh toán'),
(N'Lê Minh J', N'Cơ bản tiếng Anh', 950000, N'Chuyển khoản', '2025-10-19', N'Đã thanh toán');
GO
SELECT * FROM REVENUE;


-- Lấy tất cả giao dịch
CREATE OR ALTER PROCEDURE sp_revenue_get_all
AS
BEGIN
    SELECT * FROM REVENUE ORDER BY PaymentDate DESC;
END
GO

-- Thêm giao dịch
CREATE OR ALTER PROCEDURE sp_revenue_create
    @StudentName NVARCHAR(100),
    @CourseName NVARCHAR(100),
    @Amount DECIMAL(18,2),
    @PaymentMethod NVARCHAR(50),
    @PaymentDate DATE,
    @Status NVARCHAR(50)
AS
BEGIN
    INSERT INTO REVENUE (StudentName, CourseName, Amount, PaymentMethod, PaymentDate, Status)
    VALUES (@StudentName, @CourseName, @Amount, @PaymentMethod, @PaymentDate, @Status);
END
GO

-- Cập nhật giao dịch
CREATE OR ALTER PROCEDURE sp_revenue_update
    @RevenueID INT,
    @StudentName NVARCHAR(100),
    @CourseName NVARCHAR(100),
    @Amount DECIMAL(18,2),
    @PaymentMethod NVARCHAR(50),
    @PaymentDate DATE,
    @Status NVARCHAR(50)
AS
BEGIN
    UPDATE REVENUE
    SET StudentName = @StudentName,
        CourseName = @CourseName,
        Amount = @Amount,
        PaymentMethod = @PaymentMethod,
        PaymentDate = @PaymentDate,
        Status = @Status
    WHERE RevenueID = @RevenueID;
END
GO

-- Xóa giao dịch
CREATE OR ALTER PROCEDURE sp_revenue_delete
    @RevenueID INT
AS
BEGIN
    DELETE FROM REVENUE WHERE RevenueID = @RevenueID;
END
GO
