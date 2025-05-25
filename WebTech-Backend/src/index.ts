import Cat from './models/Cat.js';
import User from './models/User.js';

function main(args: string[] = []): void {
    console.log(new Cat("Kikki").meow());
    console.log(new User("Giuseppe", "giuseppe.mta97@gmail.com").greet());
}

main();