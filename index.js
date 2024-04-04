//Group: 36 - Iteration 2

//Main Functionality File:
//the purpose of this file is to make the Web App Restful
//meaning every time a user does something on the website we are
//able to process there requests or redirect them to the right page

//To run the file in the terminal type: node

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies


// SQLite database - this is an in-memory database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables(); // Call function to create necessary tables
    }
});

// Define tables for your classes
function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS Users(
        UserID INTEGER PRIMARY KEY AUTOINCREMENT,
        FirstName TEXT,
        LastName TEXT,
        Username TEXT,
        Password TEXT,
        Email TEXT UNIQUE,
        Phone_Number TEXT,
        Role TEXT DEFAULT 'Member',
        Classes_Attended INTEGER DEFAULT 0
    )`, (err) => {
        if (err) {
            console.error('Error creating Users table', err.message);
        } else {
            console.log('Users table created successfully.');
        }
    });

    // Create Classes table
    db.run(`CREATE TABLE IF NOT EXISTS Classes(
        ClassID INTEGER PRIMARY KEY AUTOINCREMENT,
        ClassName TEXT,
        ClassDcript TEXT,
        Coach INTEGER,
        Date DATE DEFAULT (date('now')),
        FOREIGN KEY(Coach) REFERENCES Users(UserID)
    )`, (err) => {
        if (err) {
            console.error('Error creating Classes table', err.message);
        } else {
            console.log('Classes table created successfully.');
        }
    });

    // Create Bank_Details table
    db.run(`CREATE TABLE IF NOT EXISTS Bank_Details (
        UserID INTEGER,
        Expenses REAL DEFAULT 0.00,
        Missed_Payments INTEGER DEFAULT 0,
        FOREIGN KEY(UserID) REFERENCES Users(UserID)
    )`, (err) => {
        if (err) {
            console.error('Error creating Bank_Details table', err.message);
        } else {
            console.log('Bank_Details table created successfully.');
        }
    });

    // Pay_Status is a boolean (pay or not pay true or false)
    // PayStatus was originally in an enrolled classes table, but they were the exact same as class_attendance so I moved it here
    db.run(`CREATE TABLE IF NOT EXISTS Class_Attendance (
        UserID INTEGER,
        ClassID INTEGER,
        Times_Attended INTEGER,
        Times_Paid INTEGER,
        Attendance_Status TEXT,
        Pay_Status INTEGER,
        FOREIGN KEY(UserID) REFERENCES Users(UserID),
        FOREIGN KEY(ClassID) REFERENCES Classes(ClassID)
    )`, (err) => {
        if (err) {
            console.error('Error creating Class_Attendance table', err.message);
        } else {
            console.log('Class_Attendance table created successfully.');
            // Insert sample data
            insertSampleData();
        }
    });
}

// Insert sample data into tables
function insertSampleData() {
    // Insert Users
    db.run(`INSERT INTO users (FirstName, LastName, Username, Password, Email, Phone_Number, Classes_Attended, Role) VALUES 
    ('Darn', 'Damnington', 'Darn', 'password', 'Darn@gmail.com', 4166787890,10, "Member"),
    ('Damn', 'Darnington', 'Damn', 'password', 'Damn@gmail.com', 4166987690,4, "Coach"),
    ('Dang', 'Dangington', 'Dang', 'password', 'Dang@gmail.com', 4166986424,12, "Member"),
    ('Jim', 'John', 'JimJohn123', 'password', 'JimJohn@gmail.com', 4166780988,1, "Coach"),
    ('John', 'Jim', 'JohnJim321', 'password', 'JohnJim@gmail.com', 4166758721,10, "Member"),
    ('Phil', 'The Horse', 'PhilDaHorse', 'password', 'PhilDaHorse@gmail.com', 6476789090,9, "Member"),
    ('Coach', 'From L4D2', 'CoachfromL4D2', 'password', 'Coach@gmail.com', 4370987890,0, "Member")`, (err) => {
            if (err) {
                console.error('Error inserting sample data into Users table', err.message);
            } else {
                console.log('Sample data inserted into Users table.');
            }
        });

    // Insert Classes
    db.run(`INSERT INTO Classes (ClassName, ClassDcript, Coach) VALUES 
    ('Intro to Naming thing', 'it names things', 1),
    ('Intro to Naming thing better', 'it names things but better', 1),
    ('Intro to Naming better things', 'get better at naming things', 1),
    ('Intro to names 101', 'when you dont know how to name things', 1)`, (err) => {
            if (err) {
                console.error('Error inserting sample data into Classes table', err.message);
            } else {
                console.log('Sample data inserted into Classes table.');
            }
        });

    // Insert Bank_Details
    db.run(`INSERT INTO Bank_Details (UserID) VALUES
    (1),
    (2),
    (3),
    (4)`, (err) => {
            if (err) {
                console.error('Error inserting sample data into Bank_Details table', err.message);
            } else {
                console.log('Sample data inserted into Bank_Details table.');
            }
        });

    // Insert Class_Attendance
    db.run(`INSERT INTO Class_Attendance (ClassID, UserID) VALUES
    (1,1),
    (1,3),
    (1,4),
    (1,4),
    (2,1),
    (2,2),
    (2,3),
    (3,4),
    (3,4),
    (4,3),
    (4,4)`, (err) => {
            if (err) {
                console.error('Error inserting sample data into Class_Attendance table', err.message);
            } else {
                console.log('Sample data inserted into Class_Attendance table.');
            }
        });
};

// Routes
app.get("/", async (req, res) => {
    res.render("index.ejs", {});
});


app.get("/register", async (req, res) => {
    res.render("register.ejs", {});
});

app.get("/coachDashboard", async (req, res) => {
    res.render("coachDashboard.ejs", {});
});

app.get("/memberDashboard", async (req, res) => {
    res.render("memberDashboard.ejs", {});
});

app.get("/treasurer", async (req, res) => {
    res.render("treasurer.ejs", {});
});

// Register User
app.post("/registerUser", async (req, res) => {
    const { FirstName, LastName, Email, Phone_Number, Username, Password, Role } = req.body;
    
    // Check if the email already exists
    db.get(`SELECT * FROM Users WHERE Email = ?`, [Email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Error registering user' });
        }
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        
        // If the email doesn't exist, proceed with registration
        db.run(`INSERT INTO Users (FirstName, LastName, Email, Phone_Number, Username, Password, Role) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [FirstName, LastName, Email, Phone_Number, Username, Password, Role],
            function(err) {
                if (err) {
                    return res.status(500).json({ message: 'Error registering user' });
                }
                // User successfully registered
                
            });
        if (Role == 'Member') {
            res.redirect("/memberDashboard");
        } else if (Role == 'Coach') {
            res.redirect("/coachDashboard");
        } else {
            res.redirect("/treasurer");
        }
    });
});


// Login
// Login
app.post('/login', (req, res) => {
    console.log("Request Body:", req.body);

    const { username, password } = req.body;

    console.log("Logging in:", username);
    console.log("Password:", password);

    // Retrieve user from the database
    db.get(`SELECT * FROM Users WHERE Username = ?`, [username], (err, user) => {
        if (err) {
            console.error('Error retrieving user:', err);
            return res.status(500).json({ message: 'Error logging in' });
        }

        // Check if user exists
        if (!user) {
            console.log("User not found:", username);
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare passwords
        if (password !== user.Password) {
            console.log("Incorrect password for:", username);
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // Login successful
        // Redirect to appropriate dashboard based on user's role
        if (user.Role == 'Member') {
            res.redirect("/memberDashboard");
        } else if (user.Role == 'Coach') {
            res.redirect("/coachDashboard");
        } else {
            res.redirect("/treasurer");
        }
    });
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
