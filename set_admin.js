const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
async function fix() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const result = await db.collection('users').updateOne(
    { email: 'mishramanjeet26@gmail.com' },
    { $set: { plan: 'elite', isAdmin: true } }
  );
  console.log('Modified:', result.modifiedCount);
  console.log('Done — admin + elite set!');
  await client.close();
}
fix();
