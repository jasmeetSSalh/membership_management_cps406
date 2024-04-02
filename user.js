class User {
    constructor(id, username, password, name, email, phone, role) {
        this.id = id; //primary key
        this.username = username; // unique
        this.password = password;
        this.name = name;
        this.email = email; // unique
        this.phone = phone;
        this.role = role;
    }
}
