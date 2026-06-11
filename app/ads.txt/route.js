export const dynamic = 'force-dynamic';

export async function GET() {
  return new Response(
    'google.com, pub-3976598981288611, DIRECT, f08c47fec0942fa0',
    { headers: { 'Content-Type': 'text/plain' } }
  );
}
