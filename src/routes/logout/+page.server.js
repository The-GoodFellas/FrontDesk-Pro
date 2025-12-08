export const load = async ({ cookies }) => {
  cookies.delete('fdp_session', { path: '/' });
  throw redirect(303, '/');
};