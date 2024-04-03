//Group: 36 - Iteration 2

//Main Functionality File:
//the purpose of this file is to make the Web App Restful
//meaning every time a user does something on the website we are
//able to process there requests or redirect them to the right page

//To run the file in the terminal type: node

const express = require('express');
const axios = require('axios');
const sqlite3 = require('sqlite3');

const app = express();
const port = 3000;

// SQLlite database
const db = new sqlite3.Database('database.db');
// Define tables for your classes
db.serialize(() => {
    // Create User table
    db.run(`CREATE TABLE IF NOT EXISTS Users(
        UserID INTEGER PRIMARY KEY AUTOINCREMENT,
        FirstName TEXT,
        LastName TEXT,
        Username TEXT UNIQUE,
        Password TEXT,
        Email TEXT UNIQUE,
        Phone_Number INTEGER,
        Role TEXT DEFAULT 'Member',
        Classes_Attended INTEGER DEFAULT 0
    )`);

    // Create Classes table
    db.run(`CREATE TABLE IF NOT EXISTS Classes (
        ClassID INTEGER PRIMARY KEY AUTOINCREMENT,
        ClassName TEXT,
        ClassDcript TEXT,
        Coach INTEGER,
        Date DATE DEFAULT (date('now')),
        FOREIGN KEY(Coach) REFERENCES Users(UserID)
    );`);

    // Create Bank_Details table
    db.run(`CREATE TABLE IF NOT EXISTS Bank_Details (
        UserID INTEGER,
        Expenses REAL DEFAULT 0.00,
        Missed_Payments INTEGER DEFAULT 0,
        FOREIGN KEY(UserID) REFERENCES Users(UserID)
    )`);

    //Pay_Status is a boolean (pay or not pay true or false)
    //PayStatus was originally in an enrolled classes table, but they were the exact same as class_attendance so I moved it here
    db.run(`CREATE TABLE IF NOT EXISTS Class_Attendance (
        UserID INTEGER,
        ClassID INTEGER,
        Times_Attended INTEGER,
        Times_Paid INTEGER,
        Attendance_Status TEXT,
        Pay_Status INTEGER,
        FOREIGN KEY(UserID) REFERENCES Users(UserID),
        FOREIGN KEY(ClassID) REFERENCES Classes(ClassID)
    )`);

    //dummy accounts for users table
    db.run(`INSERT INTO users (FirstName, LastName, Username, Password, Email, Phone_Number) VALUES 
    ('Darn', 'Damnington', 'Darn', 'password', 'Darn@gmail.com', 4166787890),
    ('Damn', 'Darnington', 'Damn', 'password', 'Damn@gmail.com', 4166987690),
    ('Dang', 'Dangington', 'Dang', 'password', 'Dang@gmail.com', 4166986424),
    ('Jim', 'John', 'JimJohn123', 'password', 'JimJohn@gmail.com', 4166780988),
    ('John', 'Jim', 'JohnJim321', 'password', 'JohnJim@gmail.com', 4166758721),
    ('Phil', 'The Horse', 'PhilDaHorse', 'password', 'PhilDaHorse@gmail.com', 6476789090),
    ('Coach', 'From L4D2', 'CoachfromL4D2', 'password', 'Coach@gmail.com', 4370987890)`);

    //dummy classes
    db.run(`INSERT INTO classes (ClassName, ClassDcript, Coach) VALUES 
    ('Intro to Naming thing', 'it names things', 14),
    ('Intro to Naming thing better', 'it names things but better', 14),
    ('Intro to Naming better things', 'get better at naming things', 14),
    ('Intro to names 101', 'when you dont know how to name things', 14)`);

    //dummy bank info, inserted only userID
    db.run(`INSERT INTO bank_details (UserID) VALUES
    (1),
    (2),
    (3),
    (4),
    (5),
    (6)`);

    //dummy class attendance, inserted only user and classID
    db.run(`INSERT INTO class_attendance (ClassID, UserID) VALUES
    (1,1),
    (1,3),
    (1,5),
    (1,6),
    (2,1),
    (2,2),
    (2,3),
    (3,4),
    (3,5),
    (4,3),
    (4,6)`);
});


// Middleware

app.get("/", async (req, res) => {
    res.render("index.ejs", {
        //you can send info between javascript and the html doc by putting the variable here
    });
  });

app.get("/register", async (req, res) => {
    res.render("register.ejs", {

    })
});

app.get("/couchDashboard", async (req, res) => {
    res.render("coachDashboard.ejs", {
    })
});

app.get("/memberDashboard", async (req, res) => {
    res.render("memberDashboard.ejs", {
    })
});

app.get("/treasurer", async (req, res) => {
    res.render("treasurer.ejs", {
    })
});


app.post("/registerUser", async (req, res) => {
    const {nameIn, emailIn, phoneIn, usernameIn, passwordIn, roleIn} = req.body;
    db.run(`INSERT INTO User (username, password, email, phone, role) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [usernameIn, passwordIn, nameIn, emailIn, phoneIn, roleIn],
            function(err) {
                if (err) {
                    return res.status(500).json({ message: 'Error registering user' });
                }
                // User successfully registered
                res.redirect("/dashboard");
            });
});


// POST endpoint for login
app.post('/login', (req, res) => {
    res.redirect("/treasurer");
    // const { username, password } = req.body;
    
    // db.get(`SELECT * FROM User WHERE username = ?`, [username], (err, user) => {
    //     if (err) {
    //         return res.status(500).json({ message: 'Error logging in' });
    //     }
    //     if (!user) {
    //         return res.status(404).json({ message: 'User not found' });
    //     }
    //     // Check password here
    //     if (user.password !== password) {
    //         return res.status(401).json({ message: 'Incorrect password' });
    //     }
    //     // Login successful
    //     res.status(200).json({ message: 'Login successful' });
    // });
});


//DW about this
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
