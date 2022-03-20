import { validateToken } from "../utility.ts"; 
import { Result } from "../models/result.ts";

export async function authTest(context: any) {
    try {
        const body = context.request.body({type: 'json'}); 
        const input = await body.value;

        let validationResult: Result = await validateToken(input.token);
        if (!validationResult.isSuccess) throw validationResult.errors;

        context.response.body = new Result(true, validationResult.body, null)
    } catch (e) {
        context.response.body = new Result(false, null, e);
        context.response.status = 400;
    }
}