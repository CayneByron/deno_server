import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { moment } from "https://deno.land/x/deno_moment/mod.ts";
import { Org } from "../models/org.ts";
import { Account } from "../models/account.ts";
import { sanitize, getUniqueId, getRandomString } from "../utility.ts";
import { validate, required, isNumber, isEmail, maxLength, isNumeric, isString } from "https://deno.land/x/validasaur/mod.ts";

export async function createOrg(context: any) {
    const body = context.request.body({type: 'json'}); 
    const dirtyInput = await body.value;

    let [success, error] = await validate(dirtyInput, {
        email: [required, isString, isEmail, maxLength(512)],
        name: [required, isString, maxLength(512)],
        address1: [isString, maxLength(512)],
        address2: [isString, maxLength(512)],
        city: [isString, maxLength(512)],
        state: [isString, maxLength(512)],
        country: [isString, maxLength(512)],
        postal_code: [isString, maxLength(512)],
        phone: [isString, isNumeric, maxLength(512)],
        measurements: [required, isString, maxLength(512)],
    });

    const email = dirtyInput.email;
    const input = sanitize(dirtyInput);
    let created_on = moment().utc().format();
    let created_by = 'SYSTEM';
    let type = 'PRODUCTION';

    const orgId = getUniqueId('org');
    await Org.create({
        id: orgId,
        email: email,
        name: input.name,
        address1: input.address1,
        address2: input.address2,
        city: input.city,
        state: input.state,
        country: input.country,
        postal_code: input.postal_code,
        phone: input.phone,
        created_on: created_on,
        created_by: created_by,
        type: type,
        measurements: input.measurements,
        is_deleted: false,
    });

    const accountId = getUniqueId('account');
    const hash = await bcrypt.hash(getRandomString(32));
    await Account.create({
        id: accountId,
        email: email,
        password_hash: hash,
        name: input.name,
        created_on: created_on,
        created_by: created_by,
        last_login: null,
        org_id: orgId,
        token: '',
        token_expired: null,
        is_activated:  false,
        is_deleted: false,
    });

    context.response.body = {success: success, error: error};
}
