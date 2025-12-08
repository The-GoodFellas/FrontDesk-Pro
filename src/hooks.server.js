import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
  const token = event.cookies.get('fdp_session');
  if (token) {
    try {
      const data = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
      event.locals.user = data;
    } catch (_) {
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  // Protect private routes
  const protectedPaths = [
    '/reservations',
    '/rooms',
    '/check_in',
    '/check_out',
    '/database'
  ];

  const path = event.url.pathname;
  const isProtected = protectedPaths.some((p) => path === p || path.startsWith(p + '/'));

  if (isProtected && !event.locals.user) {
    throw redirect(303, '/login');
  }

  return resolve(event);
};