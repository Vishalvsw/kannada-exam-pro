// app/notes/page.jsx - Server Component with SEO
import NotesClient from './NotesClient';

export const metadata = {
  title: 'Karnataka Exam Study Notes | Free KAS, PSI, PDO Preparation',
  description: 'Free study notes for Karnataka competitive exams including KAS, PSI, PDO, FDA, SDA. Comprehensive notes with subject-wise organization.',
  keywords: 'Karnataka exam notes, KAS study material, PSI preparation, PDO exam notes',
  openGraph: {
    title: 'Karnataka Exam Study Notes - KannadaExamPro',
    description: 'Free study notes for Karnataka competitive exams.',
    url: 'https://www.kannadaexampro.com/notes',
    type: 'website',
  },
};

async function getNotes() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/notes`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching notes:', error);
    return [];
  }
}

async function getQAQuestions() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/qa-questions`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching QA questions:', error);
    return [];
  }
}

export default async function NotesPage() {
  try {
    const [notes, qaQuestions] = await Promise.all([
      getNotes(),
      getQAQuestions()
    ]);

    return <NotesClient initialNotes={notes} initialQA={qaQuestions} />;
  } catch (error) {
    console.error('Error loading notes page:', error);
    return <NotesClient initialNotes={[]} initialQA={[]} />;
  }
}
