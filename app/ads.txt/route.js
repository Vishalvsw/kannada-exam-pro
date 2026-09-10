export const dynamic = 'force-dynamic';

export async function GET() {
  const adsTxt = [
    '# Authorized Sellers for kannadaexampro.com',
    '',
    '# Primary Google AdSense Account',
    'google.com, pub-9119771130084938, DIRECT, f08c47fec0942fa0',
    '',
    '# Tapmind',
    'tapmind.com, TMP10456, DIRECT',
    '',
    '# Google Reseller Accounts',
    'google.com, pub-1714061154748628, RESELLER, f08c47fec0942fa0',
    'google.com, pub-8686615022940025, RESELLER, f08c47fec0942fa0',
    'google.com, pub-2915053785761950, RESELLER, f08c47fec0942fa0',
    'google.com, pub-3872674820285626, RESELLER, f08c47fec0942fa0',
    '',
    '# Other Ad Networks',
    'kickads.mobi, 97, DIRECT',
    'rtbdemand.com, 22903361807, DIRECT',
  ].join('\n');

  return new Response(adsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
