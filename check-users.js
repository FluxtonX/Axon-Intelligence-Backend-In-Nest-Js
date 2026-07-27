const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/axon_db?schema=public'
});

async function run() {
  await client.connect();
  const users = await client.query('SELECT id, email FROM "User"');
  console.log('ALL USERS:');
  console.log(users.rows);
  await client.end();
}
run().catch(console.error);
