export const load = async ({ cookies }) => {
  cookies.delete('fdp_session', { path: '/' });
  return {
    status: 302,
    redirect: '/login'
  };
};