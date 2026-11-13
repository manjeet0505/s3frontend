// Run this ONCE to add plan/usage/isAdmin to existing users
// node migrate_users.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',').map(e => e.trim().toLowerCase()).filter(Boolean);

async function migrate() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db(process.env.MONGODB_DB);
  const users = db.collection('users');

  const allUsers = await users.find({}).toArray();
  console.log(`Found ${allUsers.length} users to migrate`);

  let updated = 0;
  for (const user of allUsers) {
    // Skip if already migrated
    if (user.plan !== undefined) { console.log(`Skip: ${user.email}`); continue; }

    const isAdmin = ADMIN_EMAILS.includes(user.email?.toLowerCase());
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          plan: isAdmin ? 'elite' : 'free',
          planExpiry: null,
          isAdmin,
          usage: {
            resumeUploads: 0,
            jobMatchesToday: 0,
            jobMatchesDate: '',
            skillGapCount: 0,
            skillGapMonth: '',
            linkedinRuns: 0,
            mockInterviewCount: 0,
            mockInterviewMonth: '',
          },
        },
      }
    );
    console.log(`✅ Migrated: ${user.email} (admin: ${isAdmin})`);
    updated++;
  }

  console.log(`\nDone. ${updated} users updated.`);
  await client.close();
}

migrate().catch(console.error);