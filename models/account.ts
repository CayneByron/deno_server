import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts';

export class Account extends Model {
    static table = 'account';
    static timestamps = true;

    static fields = {
        id: DataTypes.TEXT,
        email: DataTypes.TEXT,
        password_hash: DataTypes.TEXT,
        name: DataTypes.TEXT,
        created_on: DataTypes.DATETIME,
        created_by: DataTypes.TEXT,
        last_login: DataTypes.DATETIME,
        org_id: DataTypes.TEXT,
        is_activated:  DataTypes.BOOLEAN,
        is_deleted: DataTypes.BOOLEAN,
    };
}