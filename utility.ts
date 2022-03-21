import { cryptoRandomString } from "https://github.com/piyush-bhatt/crypto-random-string/raw/main/mod.ts"
import * as validator from 'https://deno.land/x/deno_validator/mod.ts';
import { validate, required, isNumber, isEmail, maxLength, isNumeric, isString, firstMessages } from "https://deno.land/x/validasaur/mod.ts";
import * as djwt from "https://deno.land/x/djwt@v2.2/mod.ts";
import { config as env } from "https://deno.land/x/dotenv/mod.ts";
import { Result } from "./models/result.ts";
import { Client } from "https://deno.land/x/postgres/mod.ts";

const whitelist = '\#QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890 _-`';

const client = new Client({
    user: env().USERNAME,
    password: env().PASSWORD,
    database: env().DATABASE,
    hostname: env().HOST,
    port: 5432,
});

export function sanitize(input: any): any {
    for (let propertyName in input) {
        input[propertyName] = validator.whitelist(input[propertyName], whitelist);
    }
    return input;
}

export function getRandomString(length: number): string {
    const id = cryptoRandomString({length: length, type: 'base64'}).replace(/\+/g, "-").replace(/\//g, "_");
    return id;
}

export async function getUniqueId(table: string): Promise<string> {
    await client.connect();
    let id: string = '';
    while (true) {
        id = getRandomString(11);
        const array_result = await client.queryArray(`SELECT id FROM ${table} WHERE id = '${id}'`);
        if (array_result.rows.length === 0) break;
    }
    await client.end();
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