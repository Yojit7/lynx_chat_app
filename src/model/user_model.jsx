class User {
    constructor(userName, email) {
        this.userName = userName;
        this.email = email;
    }

    toFirestore() {
        return {
            userName: this.userName,
            email: this.email
        };
    }
}

export default User;