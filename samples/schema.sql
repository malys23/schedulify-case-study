CREATE DATABASE IF NOT EXISTS schedulify;

USE schedulify;

CREATE TABLE IF NOT EXISTS account (
    accountid INT AUTO_INCREMENT PRIMARY KEY,          -- Primary key, auto-incremented
    role ENUM('ADMIN', 'USER') NOT NULL,            -- User role (admin or user)
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP   -- Timestamp for account creation
);

-- Login Table (depends on Account)
CREATE TABLE IF NOT EXISTS login (
    loginID INT AUTO_INCREMENT PRIMARY KEY,        -- Primary key
    email VARCHAR(255) NOT NULL UNIQUE,             -- Email, must be unique
    password_hash VARCHAR(255) NOT NULL,            -- Hashed password
    last_login TIMESTAMP NULL,                      -- Field to store last login timestamp
    accountid INT,                                  -- Foreign key to Account
    FOREIGN KEY (accountid) REFERENCES Account(accountid) -- Foreign key reference to Account
);

-- Admin Table (depends on Account)
CREATE TABLE IF NOT EXISTS admins (
    adminID INT AUTO_INCREMENT PRIMARY KEY,        -- Primary key, auto-incremented
    accountid INT NOT NULL,                            -- Foreign key to Account
    FOREIGN KEY (accountid) REFERENCES Account(accountid) -- Foreign key reference to Account
);

-- Student Table (depends on Account)
CREATE TABLE IF NOT EXISTS student (
    studentID INT AUTO_INCREMENT PRIMARY KEY,      -- Primary key, auto-incremented
    fName VARCHAR(50) NOT NULL,                     -- First name
    lName VARCHAR(50) NOT NULL,                     -- Last name
    university VARCHAR(100),                        -- University name
    semester VARCHAR(20),                           -- Semester (e.g., Fall 2024)
    semesterStart DATE,                             -- Start date of the semester
    accountid INT NOT NULL,                            -- Foreign key to Account
    FOREIGN KEY (accountid) REFERENCES Account(accountid) -- Foreign key reference to Account
);

-- Calendar Table (depends on Student)
CREATE TABLE IF NOT EXISTS calendar (
    calendarID INT AUTO_INCREMENT PRIMARY KEY,     -- Primary key
    studentID INT NOT NULL,                         -- Foreign key to Student
    calendar_name VARCHAR(255),                     -- Calendar name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for calendar creation
    FOREIGN KEY (studentID) REFERENCES Student(studentID) ON DELETE CASCADE
);

-- Event Table (depends on Calendar)
CREATE TABLE IF NOT EXISTS event (
    eventID INT AUTO_INCREMENT PRIMARY KEY,        -- Primary key
    calendarID INT NOT NULL,                        -- Foreign key to Calendar
    title VARCHAR(255) NOT NULL,                    -- Event title
    date DATETIME NOT NULL,                         -- Event date and time
    notes TEXT,                                     -- Notes for the event
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for event creation
    FOREIGN KEY (calendarID) REFERENCES Calendar(calendarID) ON DELETE CASCADE
);
