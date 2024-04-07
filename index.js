//Group: 36 - Iteration 2

//Main Functionality File:
//the purpose of this file is to make the Web App Restful
//meaning every time a user does something on the website we are
//able to process there requests or redirect them to the right page

//To run the file in the terminal type: node


const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const ejs = require('ejs');
const cors = require('cors');


const app = express();
const port = 3000;
//used to render the ejs files so we can pass data to the front end
app.set('view engine', 'ejs');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(cors()); // Enable CORS



//Importing All User Classes
const User = require('./objectClasses/user.js');
const bankDetails = require('./objectClasses/bankDetails.js');
const Classes = require('./objectClasses/classes.js');
const Pay_Status = require('./objectClasses/paymentStatus.js');
const { all } = require('axios');

// Middleware
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

//Global variable to store the logged in user
let currentUser = null;
//Global variable to store the bank details of the logged in user
let currentBankDetails = null;
//Global variable to store all the classes in the database
let allClasses = [];
//Global varibable to store the user's classes with their attendance and payment status
let userClasses = [];
//Global variable to store all the coachs
let allCoaches = [];
//Message sent to the user
let allMessages = [];
allMessages.push("reminder: you have to pay for the class you attended last week");
allMessages.push("reminder: drink plenty of water before the class");


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
    db.run(`CREATE TABLE IF NOT EXISTS Classes (
        ClassID INTEGER PRIMARY KEY AUTOINCREMENT,
        ClassName TEXT,
        ClassDcript TEXT,
        Coach INTEGER,
        Date TEXT,
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
    ('Darn', 'Damnington', 'Darn', 'password', 'Darn@gmail.com', 4166787890,10, "Treasurer"),
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
    db.run(`INSERT INTO Classes (ClassName, ClassDcript, Coach, Date) VALUES 
    ('Intro to Naming thing',        'it names things',             1, '2021-10-01'),
    ('Intro to Naming thing better', 'it names things but better',  1, '2021-11-01'),
    ('Intro to Naming better things','get better at naming things', 1, '2021-11-02'),
    ('Intro to names 101', 'when you dont know how to name things', 1, '2024-02-02')`, (err) => {
            if (err) {
                console.error('Error inserting sample data into Classes table', err.message);
            } else {
                console.log('Sample data inserted into Classes table.');
                storeAllClassesLocally();
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
    db.run(`INSERT INTO Class_Attendance (ClassID, UserID, Times_Attended, Times_Paid, Attendance_Status, Pay_Status) VALUES
    (1,1, 1, 1, 'Attended', 0),
    (1,3, 1, 1, 'Attended', 0),
    (1,4, 1, 1, 'Attended', 1),
    (1,4, 1, 1, 'Attended', 1),
    (2,1, 1, 1, 'Attended', 0),
    (2,2, 1, 1, 'Attended', 0),
    (2,3, 1, 1, 'Attended', 1),
    (3,4, 1, 1, 'Attended', 0),
    (3,4, 1, 1, 'Attended', 1),
    (4,3, 1, 1, 'Attended', 0),
    (4,4, 1, 1, 'Attended', 1)`, (err) => {
            if (err) {
                console.error('Error inserting sample data into Class_Attendance table', err.message);
            } else {
                console.log('Sample data inserted into Class_Attendance table.');
                
            }
        });
};

// Function stores all classes in the database into an array
function storeAllClassesLocally(){
    //query all the classes and store them in an array where each instance of a class is stored in the array
    db.all(`SELECT * FROM Classes`, (err, rows) => {
        if (err) {
            console.error('Error retrieving classes', err.message);
        } else {
            rows.forEach((row) => {
                allClasses.push(new Classes(row.ClassID, row.ClassName, row.ClassDcript, row.Coach, row.Date));
            });
            console.log('Classes retrieved successfully.');
        }
    }); 
}

function storeCurrentUserBankDetailsLocally(){
    db.get(`SELECT * FROM Bank_Details WHERE UserID = ?`, currentUser.UserID, (err, row) => {
        if (err) {
            console.error('Error retrieving bank details', err.message);
        } else {
            if (row) {
                currentBankDetails = [row.Expenses, row.Missed_Payments];
            } else {
                // If no bank details found for the user, initialize it to default values
                currentBankDetails = [0, 0];
            }
            console.log('Bank details retrieved successfully:', currentBankDetails);
        }
    });
}

function storeCurrentUserClassesAttendanceLocally(){
    db.all(`SELECT * FROM Class_Attendance WHERE UserID = ?`, currentUser.UserID, (err, rows) => {
        if (err) {
            console.error('Error retrieving user classes', err.message);
        } else {
            let tempUserClasses = [];
            rows.forEach((row) => {
                tempUserClasses.push(new Class_Attendance(row.UserID, row.ClassID, row.Times_Attended, row.Times_Paid, row.Attendance_Status, row.Pay_Status));
            });
            console.log('User classes retrieved successfully.');
            return tempUserClasses;
        }
    });
}

// Function to get all account receivable for the treasurer
function getAllAccountRecievable() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM Class_Attendance WHERE Pay_Status = 0`, (err, rows) => {
            if (err) {
                console.error('Error retrieving account receivable', err.message);
                reject(err);
            } else {
                let count = rows.length; // Number of unpaid classes
                console.log('Account receivable retrieved successfully.');
                resolve(count * 500); // Assuming each unpaid class contributes $50 to the accounts receivable
            }
        });
    });
}

function storeAllCoachesLocally(){
      // Get al the user's who's role is a coach and push them into the allCoaches array
      db.all(`SELECT * FROM Users WHERE Role = 'Coach'`, (err, rows) => {
        if (err) {
            console.error('Error retrieving coaches', err.message);
        } else {
            rows.forEach((row) => {
                allCoaches.push(new User(row.UserID, row.FirstName, row.LastName, row.Username, row.Password, row.Email, row.Phone_Number, row.Role));
            });
            console.log('Coaches retrieved successfully.');
        }
    });
}


// Routes
app.get("/", async (req, res) => {
    res.render("index.ejs", {});

});

app.get("/register", async (req, res) => {
    res.render("register.ejs", {});
});

app.get("/coachDashboard", async (req, res) => {
    res.render("coachDashboard.ejs", {
        allClasses: allClasses
        
    });
});

app.get("/memberDashboard", async (req, res) => {
    currentBankDetails = [300, 3];

    res.render("memberDashboard.ejs", {
        allClasses: allClasses,
        currentUser: currentUser,
        currentBankDetails: currentBankDetails,
        userClasses: userClasses,
        allMessages: allMessages
    });
});

app.get("/treasurer", async (req, res) => {
    try {

        let accountRecievable = await getAllAccountRecievable();
        let rent = 2000;
        let coachFee = accountRecievable / 20;
        let netIncome = accountRecievable - rent - coachFee;

        res.render("treasurer.ejs", {
            accountRecievable: accountRecievable,
            rent: rent,
            coachFee: coachFee,
            netIncome: netIncome,
            allCoaches: allCoaches
        });

    } catch (error) {

        console.error('Failed to calculate account receivable:', error);
        res.status(500).send("Internal Server Error");
    
    }
});



app.get("/processPayment", async (req, res) => {
    currentBankDetails = [300, 3];
    let paymentAmount = currentBankDetails[0];
    res.render("paymentProcessingPage.ejs", {
        paymentAmount: paymentAmount
    });
    //Note:
    //When the submit button on the payment processing page is clicked need to update the bank details
    //and send the treasurer back to the treasurer page
    
});


app.post('/sendMessage', (req, res) => {
    const message = req.body.message; // Access the message sent from the form
    console.log('Received message:', message);
    allMessages.push(message);
    // print all messages
    console.log('All messages:', allMessages);
});


// Enroll in a class - Member Tab
app.post("/attendClass", async (req, res) => {
    let classId = req.body.classId;
    let userId = currentUser.userId;
   
    console.log("Class ID:", classId);
    console.log("User ID:", userId);

   
    // Check if the class is already attended by the user
    db.get(`SELECT * FROM Class_Attendance WHERE ClassID = ? AND UserID = ?`, [classId, currentUser.UserID], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (row) {
            // The user has already attended this class, you could increment Times_Attended here
            return res.status(400).json({ message: 'Already enrolled in class' });
        } else {
            // Enroll the user in the class for the first time
            db.run(`INSERT INTO Class_Attendance (UserID, ClassID, Times_Attended, Times_Paid, Attendance_Status, Pay_Status) VALUES (?, ?, ?, ?, ?, ?)`, [currentUser.UserID, classId, 1, 0, 'Attended', 0], (err) => {
                if (err) {
                    console.error('Failed to enroll in class:', err.message);
                    return res.status(500).json({ message: 'Failed to enroll in class' });
                } else {
                    return res.status(200).json({ message: 'Successfully enrolled in class' });
                }
            });
        }
    });

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
            });
        currentUser = new User(FirstName, LastName, Email, Phone_Number, Username, Role);
        currentBankDetails = storeCurrentUserBankDetailsLocally();
        userClasses = storeCurrentUserClassesAttendanceLocally();
        storeAllCoachesLocally();

        storeCurrentUserBankDetailsLocally();
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

        currentUser = new User(user.UserID, user.FirstName, user.LastName, user.Username, user.Password, user.Email, user.Phone_Number, user.Role);
        currentBankDetails = storeCurrentUserBankDetailsLocally();
        userClasses = storeCurrentUserClassesAttendanceLocally();
        storeAllCoachesLocally();
        

        // Login successful
        // Redirect to appropriate dashboard based on user's role
        if (user.Role == 'Member') {
            res.redirect("/memberDashboard");
            user = user;
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



