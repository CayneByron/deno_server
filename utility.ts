import * as validator from 'https://deno.land/x/deno_validator/mod.ts';

const whitelist = '\#QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890 _-`';

export function sanitize(input: any): any {
    for (let propertyName in input) {
        input[propertyName] = validator.whitelist(input[propertyName], whitelist);
    }

    return input;
}