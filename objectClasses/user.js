class User {
    constructor(userId, username, password, firstName, lastName, email, phone, role) {
        this.userId = userId; //primary key
        this.username = username; // unique
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email; // unique
        this.phone = phone;
        this.role = role;
    }
}

module.exports = User;
