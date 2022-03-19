import { DataTypes, Model } from 'https://deno.land/x/denodb/mod.ts';

export class Org extends Model {
    static table = 'org';
    static timestamps = true;

    static fields = {
        id: DataTypes.TEXT,
        email: DataTypes.TEXT,
        name: DataTypes.TEXT,
        address1: DataTypes.TEXT,
        address2: DataTypes.TEXT,
        city: DataTypes.TEXT,
        state: DataTypes.TEXT,
        country: DataTypes.TEXT,
        postal_code: DataTypes.TEXT,
        phone: DataTypes.TEXT,
        created_on: DataTypes.DATETIME,
        created_by: DataTypes.TEXT,
        type: DataTypes.TEXT,
        measurements: DataTypes.TEXT,
        is_deleted: DataTypes.BOOLEAN,
    };
}