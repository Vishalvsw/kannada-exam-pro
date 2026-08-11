// app/utils/api.js
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kannadaexampro.com';

export async function fetchData(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    return await res.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export async function getNotes() {
  return fetchData('/api/notes');
}

export async function getQAQuestions() {
  return fetchData('/api/qa-questions');
}

export async function getCurrentAffairs() {
  return fetchData('/api/current-affairs');
}

export async function getQuestions() {
  return fetchData('/api/questions');
}