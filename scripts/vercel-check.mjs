const required = ['DATABASE_URL', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET'];

function mask(value) {
  if (!value) return '(missing)';
  const s = String(value);
  if (s.length <= 8) return '********';
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}

const env = process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown';

const missing = required.filter((k) => !process.env[k]);

if (missing.length > 0) {
  console.error('Vercel build env check failed');
  console.error(`Environment: ${env}`);
  console.error('Missing required environment variables:');
  for (const k of missing) console.error(`- ${k}`);
  console.error('\nSet these in Vercel → Project → Settings → Environment Variables.');
  console.error('Make sure they are enabled for the correct deployment type (Preview vs Production).');
  process.exit(1);
}

// Print minimal confirmation without leaking secrets.
console.log('Vercel build env check passed');
console.log(`Environment: ${env}`);
for (const k of required) console.log(`${k}=${mask(process.env[k])}`);
