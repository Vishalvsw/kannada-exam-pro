const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

async function testConnection() {
  console.log('Testing MongoDB connection...');
  console.log('URI:', MONGODB_URI ? '✅ Found' : '❌ Missing');
  
  if (!MONGODB_URI) {
    console.log('❌ Please add MONGODB_URI to .env.local');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test creating a collection
    const testSchema = new mongoose.Schema({ name: String });
    const Test = mongoose.models.Test || mongoose.model('Test', testSchema);
    await Test.create({ name: 'Test Entry' });
    console.log('✅ Successfully wrote to database!');
    
    await mongoose.disconnect();
    console.log('✅ Test completed! Database is working.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();