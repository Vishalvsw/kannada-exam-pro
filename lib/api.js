const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  async getQuestions() {
    try {
      const res = await fetch(`${API_URL}/api/questions`);
      return await res.json();
    } catch (error) {
      console.error('Error fetching questions:', error);
      // Return fallback questions
      return [
        {
          "_id": "1",
          "question": "What is the capital of Karnataka?",
          "options": ["Mysore", "Hubli", "Bengaluru", "Mangaluru"],
          "answer": "Bengaluru",
          "category": "Karnataka GK"
        },
        {
          "_id": "2",
          "question": "Which is the official language of Karnataka?",
          "options": ["Tamil", "Telugu", "Kannada", "Malayalam"],
          "answer": "Kannada",
          "category": "Karnataka GK"
        }
      ];
    }
  },
  
  async getLeaderboard() {
    try {
      const res = await fetch(`${API_URL}/api/leaderboard`);
      return await res.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  },
  
  async updateScore(email, score, total) {
    try {
      const res = await fetch(`${API_URL}/api/users/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, score, total })
      });
      return await res.json();
    } catch (error) {
      console.error('Error updating score:', error);
      return { success: false };
    }
  },
  
  async updateInstagram(email, instagramId) {
    try {
      const res = await fetch(`${API_URL}/api/user/instagram`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, instagramId })
      });
      return await res.json();
    } catch (error) {
      console.error('Error updating Instagram:', error);
      return { success: false };
    }
  },
  
  async getAnalytics() {
    try {
      const res = await fetch(`${API_URL}/api/analytics/daily`);
      return await res.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return {
        daily_active_users: 12400,
        total_users: 62000,
        engagement_rate: "20.5%"
      };
    }
  }
};
