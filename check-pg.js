const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/axon_db?schema=public'
});

async function run() {
  await client.connect();
  const res = await client.query('SELECT * FROM "Message"');
  console.log('MESSAGES IN DB:', res.rows.length);
  console.log(res.rows);
  const users = await client.query('SELECT id, email FROM "User"');
  console.log('USERS IN DB:', users.rows.length);
  await client.end();
}
run().catch(console.error);
