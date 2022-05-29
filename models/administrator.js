class Administrator {
    constructor(username, password){
        this.username = username;
        this.password = password;
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