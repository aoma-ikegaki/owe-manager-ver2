const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
(async () => {
  await sql`drop table if exists "account" cascade`;
  await sql`drop table if exists "session" cascade`;
  await sql`drop table if exists "verification_token" cascade`;
  await sql`drop table if exists "debts" cascade`;
  await sql`drop table if exists "user" cascade`;
  console.log('dropped');
  await sql.end();
})();
