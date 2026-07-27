const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/axon_db?schema=public'
});

async function run() {
  await client.connect();
  const msgs = await client.query('SELECT id, "senderId", "receiverId" FROM "Message"');
  const users = await client.query('SELECT id FROM "User"');
  const userIds = new Set(users.rows.map(u => u.id));

  let orphaned = 0;
  for (const m of msgs.rows) {
    if (!userIds.has(m.senderId)) {
      console.log('Orphaned Sender:', m.id, 'Sender:', m.senderId);
      orphaned++;
    }
    if (!userIds.has(m.receiverId)) {
      console.log('Orphaned Receiver:', m.id, 'Receiver:', m.receiverId);
      orphaned++;
    }
  }
  console.log('Total orphaned:', orphaned);
  await client.end();
}
run().catch(console.error);
