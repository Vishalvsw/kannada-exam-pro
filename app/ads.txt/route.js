export const dynamic = 'force-dynamic';



// /pub-9119771130084938, DIRECT, f08c47fec0942fa0
export async function GET() {
  return new Response(
    'google.com, pub-9119771130084938, DIRECT, f08c47fec0942fa0',
    { headers: { 'Content-Type': 'text/plain' } }
  );
}
