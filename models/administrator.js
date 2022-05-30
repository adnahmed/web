class Administrator {
    constructor(username, password, first_name, last_name){
        this.username = username;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name;
    }
    first_name(newFirstName) {
        this.first_name = newFirstName;
        return this;
    }
    last_name(newLastName) {
        this.last_name = newLastName;
        return this;
    }
    username(newusername) {
        this.username = newusername;
        return this;
    }
    password(newpassword) {
        this.password = newpassword;
        return this;
    }
}

module.exports = Administrator;