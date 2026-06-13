const postgres = require('postgres');
const sql = postgres(process.env.DATABASE_URL, { ssl: 'require' });
(async () => {
  const rows = await sql`select table_name from information_schema.tables where table_schema='public' order by table_name`;
  console.log(rows.map(r => r.table_name));
  await sql.end();
})();
