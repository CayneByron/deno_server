export class Result {
    isSuccess: boolean;
    body: any;
    errors: any;

    constructor(isSuccess: boolean, body: any, errors: any) {
        this.isSuccess = isSuccess;
        this.body = body;
        this.errors = errors;
    }
}