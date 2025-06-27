class ErrorMsg {
    msg: string;

    constructor(msg: string) {
        this.msg = msg;
    }
}

export class ErrorsJson {
    private readonly errors: Array<ErrorMsg>;

    constructor(errors: Array<ErrorMsg>) {
        this.errors = errors;
    }

    static fromMessage(msg: string) {
        const instance = new ErrorsJson(new Array<ErrorMsg>());
        instance.errors.push(new ErrorMsg(msg));
        return instance;
    }
}