import crypto from 'node:crypto';
import { sendJson } from './http.js';

function newRequestId() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function summarizeError(error) {
  if (!error || typeof error !== 'object') return { message: String(error) };

  return {
    name: error.name,
    code: error.code,
    message: error.message,
    stack: error.stack,
  };
}

function mapToUserMessage(error) {
  const code = error?.code;
  const msg = String(error?.message || '');

  if (code === 'P1001' || msg.includes('P1001')) return 'Database connection failed';
  if (code === 'P2021' || /relation .* does not exist/i.test(msg) || /does not exist/i.test(msg)) {
    return 'Database schema is not migrated (run prisma migrate deploy)';
  }
  if (code === 'P2002') return 'Duplicate record';

  return 'Internal server error';
}

export function sendServerError(res, context, error) {
  const requestId = newRequestId();
  console.error(`${context} (${requestId})`, summarizeError(error));

  const message = mapToUserMessage(error);
  return sendJson(res, 500, { message, error: message, requestId });
}
