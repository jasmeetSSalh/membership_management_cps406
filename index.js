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
    db.run(`CREATE TABLE IF NOT EXISTS User (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        name TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        role TEXT
    )`);

    // Create userClasses table
    db.run(`CREATE TABLE IF NOT EXISTS userClasses (
        id INTEGER PRIMARY KEY,
        classTaken TEXT,
        classAttended TEXT,
        FOREIGN KEY (id) REFERENCES User(id)
    )`);

    // Create bankDetails table
    db.run(`CREATE TABLE IF NOT EXISTS bankDetails (
        id INTEGER PRIMARY KEY,
        address TEXT,
        expenses REAL,
        payStatus TEXT,
        timesPaid INTEGER,
        missedPayment INTEGER,
        FOREIGN KEY (id) REFERENCES User(id)
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
