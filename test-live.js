// Run this in browser console on your live site

async function fullSystemTest() {
  console.log('🚀 Starting Full System Test\n');
  
  const results = {
    apiStatus: {},
    dataCounts: {},
    testResult: null
  };
  
  // 1. Test GET Questions
  console.log('1️⃣ Testing GET /api/questions...');
  try {
    const getRes = await fetch('/api/questions');
    const getData = await getRes.json();
    results.apiStatus.get = getRes.status;
    results.dataCounts.questions = Array.isArray(getData) ? getData.length : 0;
    console.log(`   ✅ Status: ${getRes.status}, Questions: ${results.dataCounts.questions}`);
  } catch(e) {
    results.apiStatus.get = 'error';
    console.log(`   ❌ Error: ${e.message}`);
  }
  
  // 2. Test POST Question
  console.log('\n2️⃣ Testing POST /api/questions...');
  const testQuestion = {
    question: "Test Question " + new Date().toISOString(),
    options: ["Option A", "Option B", "Option C", "Option D"],
    answer: "Option A",
    category: "Test",
    difficulty: "easy"
  };
  
  try {
    const postRes = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testQuestion)
    });
    const postData = await postRes.json();
    results.apiStatus.post = postRes.status;
    results.testResult = postData;
    console.log(`   ✅ Status: ${postRes.status}`);
    if (postRes.status === 201) {
      console.log(`   ✅ Question saved with ID: ${postData._id}`);
    } else {
      console.log(`   ⚠️ Response:`, postData);
    }
  } catch(e) {
    results.apiStatus.post = 'error';
    console.log(`   ❌ Error: ${e.message}`);
  }
  
  // 3. Test Leaderboard
  console.log('\n3️⃣ Testing GET /api/leaderboard...');
  try {
    const lbRes = await fetch('/api/leaderboard');
    const lbData = await lbRes.json();
    results.apiStatus.leaderboard = lbRes.status;
    results.dataCounts.users = Array.isArray(lbData) ? lbData.length : 0;
    console.log(`   ✅ Status: ${lbRes.status}, Users: ${results.dataCounts.users}`);
  } catch(e) {
    results.apiStatus.leaderboard = 'error';
    console.log(`   ❌ Error: ${e.message}`);
  }
  
  // 4. Summary
  console.log('\n📊 SUMMARY');
  console.log('=================================');
  console.log(`Database Status: ${results.dataCounts.questions > 0 ? '✅ Has Data' : '⚠️ No Questions Yet'}`);
  console.log(`API Health: ${Object.values(results.apiStatus).every(s => s === 200 || s === 201) ? '✅ All Good' : '⚠️ Some Issues'}`);
  console.log('\n🔧 Next Steps:');
  if (results.apiStatus.post === 201) {
    console.log('✅ Question added successfully! Check admin panel.');
  } else if (results.apiStatus.post === 500) {
    console.log('❌ Server error - check Vercel environment variables');
    console.log('   1. Go to Vercel Dashboard → Settings → Environment Variables');
    console.log('   2. Verify MONGODB_URI is set correctly');
    console.log('   3. Redeploy the application');
  } else if (results.apiStatus.post === 401 || results.apiStatus.post === 403) {
    console.log('❌ Authentication error - check admin token');
  }
  
  return results;
}

fullSystemTest();
