const { MongoClient } = require('mongodb');

// Use your actual password
const uri = "mongodb+srv://kannadaexampro:Vishal422@cluster.evkpgnd.mongodb.net/kannada_exam_pro?retryWrites=true&w=majority";
mongodb+srv://kannadaexampro:<db_password>@cluster0.ssqzwoz.mongodb.net/?appName=Cluster0
async function test() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log("✅ Connected successfully!");
    
    const db = client.db("kannada_exam_pro");
    const collections = await db.listCollections().toArray();
    console.log("📚 Collections:", collections.map(c => c.name));
    
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await client.close();
  }
}

test();
