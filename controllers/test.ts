import { validate, required, isNumber, isEmail, maxLength, isNumeric, isString } from "https://deno.land/x/validasaur/mod.ts";
import * as djwt from "https://deno.land/x/djwt@v2.2/mod.ts";
import { config as env } from "https://deno.land/x/dotenv/mod.ts";

export async function authTest(context: any) {
    try {
        const body = context.request.body({type: 'json'}); 
        const input = await body.value;

        let [success, error] = await validate(input, {
            token: [required, isString],
        });

        if (!success) {
            context.response.body = {success: success, error: error};
            return;
        }

        let payload = await djwt.verify(input.token, env().SECRET, "HS512")

        context.response.body = {success: true, payload: payload, error: {}};
    } catch (e) {
        context.response.body = {success: false, error: e.message};
    }
}