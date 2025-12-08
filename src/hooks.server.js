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

  return resolve(event);
};