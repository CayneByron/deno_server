import { AbstractMigration, Info, ClientPostgreSQL } from "https://deno.land/x/nessie@2.0.5/mod.ts";

export default class extends AbstractMigration<ClientPostgreSQL> {
    /** Runs on migrate */
    async up(info: Info): Promise<void> {
        await this.client.queryArray(`
            CREATE TABLE org (
                id text PRIMARY KEY,
                email text UNIQUE NOT NULL,
                name text NOT NULL,
                address1 text NOT NULL,
                address2 text NOT NULL,
                city text NOT NULL,
                state text NOT NULL,
                country text NOT NULL,
                postal_code text NOT NULL,
                phone text NOT NULL,
                created_on timestamp without time zone NOT NULL,
                created_by text NOT NULL,
                type text NOT NULL,
                measurements text NOT NULL,
                is_deleted boolean NOT NULL
            );
        `);

        await this.client.queryArray(`
            CREATE TABLE account (
                id text PRIMARY KEY,
                email text UNIQUE NOT NULL,
                password_hash text NOT NULL,
                name text NOT NULL,
                created_on timestamp without time zone NOT NULL,
                created_by text NOT NULL,
                last_login timestamp without time zone,
                org_id text NOT NULL,
                token text NOT NULL,
                token_expired timestamp without time zone,
                is_activated boolean NOT NULL,
                is_deleted boolean NOT NULL
            );
        `);
    }
    
    /** Runs on rollback */
    async down(info: Info): Promise<void> {
        await this.client.queryArray("DROP table org;");
        await this.client.queryArray("DROP table account;");
    }
}
