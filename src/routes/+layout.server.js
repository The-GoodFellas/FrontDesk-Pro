import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
  const user = locals.user || null;
  const protectedPaths = ['/reservations', '/rooms', '/check_in', '/check_out', '/database'];
  const path = url.pathname;
  const isProtected = protectedPaths.some((p) => path === p || path.startsWith(p + '/'));
  if (isProtected && !user) {
    throw redirect(303, '/login');
  }
  return { user };
};