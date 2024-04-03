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
        Classes_Attended INTEGER
    )`);

    // Create userClasses table
    db.run(`CREATE TABLE IF NOT EXISTS Classes (
        ClassID INTEGER PRIMARY KEY AUTOINCREMENT,
        ClassName TEXT,
        ClassDcript TEXT,
        Coach INTEGER,
        Date DATE DEFAULT (date('now')),
        FOREIGN KEY(Coach) REFERENCES Users(UserID)
    );`);

    // Create bankDetails table
    db.run(`CREATE TABLE IF NOT EXISTS Bank_Details (
        UserID INTEGER,
        Expenses REAL DEFAULT 0.00,
        Missed_Payments INTEGER DEFAULT 0,
        FOREIGN KEY(UserID) REFERENCES Users(UserID)
    )`);

    //Pay_Status is a boolean (pay or not pay true or false)
    db.run(`CREATE TABLE IF NOT EXISTS Enrolled_Classes (
        UserID INTEGER,
        ClassID INTEGER,
        Pay_Status INTEGER,
        FOREIGN KEY(UserID) REFERENCES Users(UserID),
        FOREIGN KEY(ClassID) REFERENCES Classes(ClassID)
    )`);
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
