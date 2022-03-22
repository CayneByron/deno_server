import {
    ClientMySQL,
    ClientPostgreSQL,
    ClientSQLite,
    NessieConfig,
} from "https://deno.land/x/nessie@2.0.5/mod.ts";
import { config as env } from "https://deno.land/x/dotenv/mod.ts";

/** Select one of the supported clients */
const client = new ClientPostgreSQL({
    database: env().DATABASE,
    hostname: env().HOST,
    port: env().PORT,
    user: env().USERNAME,
    password: env().PASSWORD,
});

/** This is the final config object */
const config: NessieConfig = {
    client,
    migrationFolders: ["./db/migrations"],
    seedFolders: ["./db/seeds"],
};

export default config;
