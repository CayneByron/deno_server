import { cryptoRandomString } from "https://github.com/piyush-bhatt/crypto-random-string/raw/main/mod.ts"
import * as validator from 'https://deno.land/x/deno_validator/mod.ts';
import { validate, required, isNumber, isEmail, maxLength, isNumeric, isString, firstMessages } from "https://deno.land/x/validasaur/mod.ts";
import * as djwt from "https://deno.land/x/djwt@v2.2/mod.ts";
import { config as env } from "https://deno.land/x/dotenv/mod.ts";
import { Result } from "./models/result.ts";

const whitelist = '\#QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890 _-`';

export function sanitize(input: any): any {
    for (let propertyName in input) {
        input[propertyName] = validator.whitelist(input[propertyName], whitelist);
    }

    return input;
}

export function getUniqueId(record: string): string {
    const id = cryptoRandomString({length: 11, type: 'base64'}).replace(/\+/g, "-").replace(/\//g, "_");
    //todo: check for existing record here
    return id;
}

export function getRandomString(length: number): string {
    const id = cryptoRandomString({length: length, type: 'base64'}).replace(/\+/g, "-").replace(/\//g, "_");
    
    return id;
}

export async function validateToken(token: string) {
    try {
        let [isSuccess, errors] = await validate({token: token}, {
            token: [required, isString],
        });

        if (!isSuccess) throw Object.values(firstMessages(errors));

        let payload = await djwt.verify(token, env().SECRET, "HS512");

        return new Result(true, payload, null);
    } catch (e) {
        return new Result(false, null, e.message);
    }
}