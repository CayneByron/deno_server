import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { Account } from "../models/account.ts";
import { validate, required, isNumber, isEmail, maxLength, isNumeric, isString, firstMessages } from "https://deno.land/x/validasaur/mod.ts";
import * as djwt from "https://deno.land/x/djwt@v2.2/mod.ts";
import { config as env } from "https://deno.land/x/dotenv/mod.ts";

export async function authenticate(context: any) {
    try {
        const body = context.request.body({type: 'json'}); 
        const input = await body.value;

        let [success, errors] = await validate(input, {
            email: [required, isString, isEmail, maxLength(512)],
            password: [required, isString, maxLength(512)],
        });

        if (!success) throw Object.values(firstMessages(errors));

        let accounts: any = await Account
            .select('id', 'email', 'password_hash')
            .where({ email: input.email })
            .limit(1)
            .get();

        if (accounts.length === 0) throw { "message":"Account not found" };

        const hash = accounts[0].password_hash;
        const result = await bcrypt.compare(input.password, hash);

        if (!result) throw { "message" : "Invalid email / password" };

        accounts[0].exp = djwt.getNumericDate(60*60);
        const jwt = await djwt.create({ alg: "HS512", typ: "JWT" }, accounts[0], env().SECRET);
        context.response.body = { success: true, token: jwt, error: [] };
    } catch (e) {
        context.response.body = { success: false, error: e };
        context.response.status = 400;
    }
}