import jwt from 'jsonwebtoken';
import { sendJson, setCorsHeaders } from './http.js';

const JWT_SECRET = process.env.JWT_SECRET;

export function requireEnv(name) {
  if (!process.env[name]) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return process.env[name];
}

export function getBearerToken(req) {
  const auth = req.headers?.authorization || req.headers?.Authorization;
  if (!auth || typeof auth !== 'string') return null;
  const match = auth.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

export function verifyAccessToken(token) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
  }
  return jwt.verify(token, JWT_SECRET);
}

export function unauthorized(res, message = 'Unauthorized') {
  setCorsHeaders(res);
  sendJson(res, 401, { message });
}

export function methodNotAllowed(res, methods) {
  setCorsHeaders(res);
  res.setHeader('Allow', methods.join(', '));
  sendJson(res, 405, { message: 'Method not allowed' });
}
