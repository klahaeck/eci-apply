export const getUser = async (userId) => {
  const tokenReqOptions = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
      grant_type: 'client_credentials'
    })
  };
  const reqToken = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, tokenReqOptions);
  const jsonToken = await reqToken.json();

  let url = new URL(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}`);

  const reqUser = await fetch(url, {
    method: 'GET',
    headers: { authorization: `Bearer ${jsonToken.access_token}` }
  });
  const jsonUser = await reqUser.json();

  return jsonUser;
}

export const isAdmin = (user) => user && user['https://midwayart.org/roles'].includes('vaf_admin');
export const isJuror = (user) => user && user['https://midwayart.org/roles'].includes('vaf_juror');
export const getRole = (user) => user && isAdmin(user) ? 'admin' : user && isJuror(user) ? 'juror' : null;