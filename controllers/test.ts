import { validate, required, isNumber, isEmail, maxLength, isNumeric, isString, firstMessages } from "https://deno.land/x/validasaur/mod.ts";
import * as djwt from "https://deno.land/x/djwt@v2.2/mod.ts";
import { config as env } from "https://deno.land/x/dotenv/mod.ts";

export async function authTest(context: any) {
    try {
        const body = context.request.body({type: 'json'}); 
        const input = await body.value;

        let [success, errors] = await validate(input, {
            token: [required, isString],
        });

        if (!success) throw Object.values(firstMessages(errors));

        let payload = await djwt.verify(input.token, env().SECRET, "HS512")

        context.response.body = {success: true, payload: payload, error: {}};
    } catch (e) {
        context.response.body = {success: false, error: e};
    }
}