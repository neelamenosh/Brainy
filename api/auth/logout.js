import { methodNotAllowed } from '../_lib/auth.js';
import { sendJson } from '../_lib/http.js';

export default async function handler(req, res) {
	if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
	return sendJson(res, 200, { message: 'Logged out successfully' });
}
