import { cryptoRandomString } from "https://github.com/piyush-bhatt/crypto-random-string/raw/main/mod.ts"
import * as validator from 'https://deno.land/x/deno_validator/mod.ts';

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