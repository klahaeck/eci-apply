import nextConnect from 'next-connect';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import fetch from 'node-fetch';
import { isAdmin } from '../../../lib/utils';

const handler = nextConnect();

handler.get(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  if (!isAdmin(user)) {
    return res.status(403).send('You do not have permission');
  }
  const { query } = req;

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

  let url = new URL(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users`);

  if (query.q) {
    const params = { q: `name:*${query.q}*`, search_engine: 'v3' };
    for (let p in params) {
      url.searchParams.append(p, params[p]);
    }
  }

  const reqUsers = await fetch(url, {
    method: 'GET',
    headers: { authorization: `Bearer ${jsonToken.access_token}` }
  });
  const jsonUsers = await reqUsers.json();

  return res.json(jsonUsers);
}));

export default handler;