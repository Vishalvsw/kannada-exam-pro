// app/utils/api.js
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kannadaexampro.com';

export async function fetchData(endpoint) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${endpoint}: ${res.status}`);
    }
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