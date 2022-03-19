import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { config as env } from "https://deno.land/x/dotenv/mod.ts";
import { Database, PostgresConnector } from 'https://deno.land/x/denodb/mod.ts';
import { Account } from "./models/account.ts";
import { Org } from "./models/org.ts";
import { createOrg } from "./controllers/org.ts"; 

const connection = new PostgresConnector({
    host: env().HOST,
    username: env().USERNAME,
    password: env().PASSWORD,
    database: env().DATABASE,
});

const db = new Database(connection);
db.link([Org, Account]);
await db.sync({drop: false});

const router = new Router();
router
    .get("/", async (context) => {
        context.response.body = 'Deno Server!';
    })
    .post("/org", createOrg);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({port: 8000});