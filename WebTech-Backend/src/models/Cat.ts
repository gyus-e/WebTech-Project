export default class Cat {
    public name: string;

    constructor(name: string) {
        this.name = name;
    }

    public meow(): string {
        return `${this.name} says meow!`;
    }
}