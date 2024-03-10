//Group: 36 - Iteration 2

//Main Functionality File:
//the purpose of this file is to make the Web App Restful
//meaning every time a user does something on the website we are
//able to process there requests or redirect them to the right page

//To run the file in the terminal type: node

const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;


app.get("/", async (req, res) => {
    res.render("index.ejs", {
        //you can send info between javascript and the html doc by putting the variable here
    });
  });

app.get("/register", async (req, res) => {
    res.render("register.ejs", {

    })
});

app.get("/dashboard", async (req, res) => {
    res.render("dashboard.ejs", {
        
    })
});


app.post("/registerUser", async (req, res) => {
    const { usernameIn, passwordIn } = req.body;
    // Ensure usernamePassword array is defined, preferably at the top of your script
    // For example: let usernamePassword = [];
    usernamePassword.push({ username: usernameIn, password: passwordIn });
    res.redirect("/dashboard"); // Redirect to login page after registration
});



// Array of username-password pairs
const usernamePassword = [
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' },
    // Add more username-password pairs as needed - The register form does this
];


// POST endpoint for login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Check if username exists in the usernamePassword array
    const user = usernamePassword.find(user => user.username === username);

    if (!user) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }
    if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid username or password' });
    }

    //else if everything is there
    res.status(200).json({ message: 'Login successful' });
});



//DW about this
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
