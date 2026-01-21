function parseCsv(value) {
  if (!value || typeof value !== 'string') return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);
}

function getAllowedOrigins() {
  const explicit = parseCsv(process.env.CORS_ALLOW_ORIGINS || process.env.CORS_ALLOWED_ORIGINS);
  const frontend = parseCsv(process.env.FRONTEND_ORIGIN || process.env.FRONTEND_URL);
  const vercel = parseCsv(process.env.VERCEL_URL).map((host) => (host.startsWith('http') ? host : `https://${host}`));
  return [...explicit, ...frontend, ...vercel];
}

function isOriginAllowed(origin) {
  if (!origin || typeof origin !== 'string') return false;

  if (process.env.CORS_ALLOW_ALL === 'true') return true;

  const allowList = getAllowedOrigins();
  if (allowList.includes(origin)) return true;

  // Allow localhost in dev and Vercel preview domains by default.
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  if (/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return true;
  if (/^https?:\/\/.*\.vercel\.app$/.test(origin)) return true;

  return false;
}

export function applyCors(req, res) {
  const origin = req?.headers?.origin;
  if (!origin) return;

  if (isOriginAllowed(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    // If you later switch to cookies, also set: Access-Control-Allow-Credentials: true
  }
}

export function handleCors(req, res, { methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] } = {}) {
  applyCors(req, res);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
    res.setHeader(
      'Access-Control-Allow-Headers',
      req.headers?.['access-control-request-headers'] || 'Content-Type, Authorization'
    );
    res.statusCode = 204;
    res.end();
    return true;
  }

  return false;
}

export function sendJson(res, statusCode, payload) {
  // Best-effort: Node/Vercel ServerResponse usually has res.req.
  // This ensures errors & early returns still include CORS headers.
  applyCors(res.req, res);

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}
