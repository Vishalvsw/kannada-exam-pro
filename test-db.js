const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Checking environment variables...');
console.log('MONGODB_URI exists?', !!MONGODB_URI);
console.log('Value starts with:', MONGODB_URI ? MONGODB_URI.substring(0, 50) + '...' : 'undefined');

if (!MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI not found in .env.local');
  process.exit(1);
}

async function testConnection() {
  try {
    console.log('\n🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected successfully!');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(`📚 Collections: ${collections.map(c => c.name).join(', ')}`);
    
    await mongoose.disconnect();
    console.log('✅ Test completed!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
