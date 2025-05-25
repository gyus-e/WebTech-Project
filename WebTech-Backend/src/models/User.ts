export default class User {
    public username: string;
    public email: string;

    constructor(username: string, email: string) {
        this.username = username;
        this.email = email;
    }

    public greet(): string {
        return `Hello, ${this.username}! Your email is ${this.email}.`;
    }
}