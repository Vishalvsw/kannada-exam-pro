const mongoose = require('mongoose');

// Using your exact username and password
const MONGODB_URI = 'mongodb+srv://kexampro_db_user:vishal422@cluster.evkpgnd.mongodb.net/kannada_exam_pro?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name).length > 0 ? collections.map(c => c.name) : '(no collections yet)');
    
    await mongoose.disconnect();
    console.log('✅ Test Complete!');
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
  }
}

testConnection();
