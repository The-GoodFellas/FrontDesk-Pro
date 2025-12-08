import { json } from '@sveltejs/kit';
import db, { initSchema } from '$lib/db.js';
import bcrypt from 'bcryptjs';

export const POST = async ({ request, cookies, url }) => {
  initSchema();
  const action = url.searchParams.get('action') || 'login';
  const body = await request.json().catch(() => ({}));

  if (action === 'login') {
    const { username, password } = body;
    if (!username || !password) return json({ ok: false, error: 'Missing credentials' }, { status: 400 });

    const user = db.prepare('SELECT id, username, password_hash, role FROM users WHERE username = ?').get(username);
    if (!user) return json({ ok: false, error: 'Invalid credentials' }, { status: 401 });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return json({ ok: false, error: 'Invalid credentials' }, { status: 401 });

    const tokenPayload = { id: user.id, username: user.username, role: user.role };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    cookies.set('fdp_session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 60 * 60 * 8
    });
    return json({ ok: true, user: tokenPayload });
  }

  if (action === 'logout') {
    cookies.delete('fdp_session', { path: '/' });
    return json({ ok: true });
  }

  return json({ ok: false, error: 'Unknown action' }, { status: 400 });
};

export const PUT = async ({ request }) => {
  initSchema();
  const { username, password, role = 'STAFF', email } = await request.json();
  if (!username || !password) {
    return json({ ok: false, error: 'Username and password required' }, { status: 400 });
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    const stmt = db.prepare('INSERT INTO users (username, password_hash, role, email) VALUES (?, ?, ?, ?)');
    const info = stmt.run(username, hash, role, email || null);
    return json({ ok: true, id: info.lastInsertRowid });
  } catch (e) {
    return json({ ok: false, error: 'User create failed' }, { status: 400 });
  }
};