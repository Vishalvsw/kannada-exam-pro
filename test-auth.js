const { MongoClient } = require('mongodb');

// Test with explicit auth
const uri = 'mongodb+srv://kannada_admin:Kannada%402027@cluster.evkpgnd.mongodb.net/';

async function test() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Auth successful!');
    const dbs = await client.db().admin().listDatabases();
    console.log('📁 Databases:', dbs.databases.map(d => d.name));
  } catch (err) {
    console.error('❌ Auth failed:', err.message);
  } finally {
    await client.close();
  }
}

test();
