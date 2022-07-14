import nextConnect from 'next-connect';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import fetch from 'node-fetch';
import { getUser, isAdmin } from '../../../lib/users';

const handler = nextConnect();

handler.get(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const { query: { userId} } = req;

  if (!isAdmin(user) && user.sub !== userId) {
    return res.status(403).send('You do not have permission');
  }

  const userJson = await getUser(userId);

  return res.json(userJson);
}));

handler.put(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const { query, body } = req;

  if (!isAdmin(user) && user.sub !== query.user_id) {
    return res.status(403).send('You do not have permission');
  }

  // console.log(body);
  // body.connection = 'Username-Password-Authentication';

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

  let url = new URL(`${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${query.user_id}`);

  const updatedUserReq = await fetch(url, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${jsonToken.access_token}`
    },
    body: JSON.stringify(body)
  });
  const updatedUser = await updatedUserReq.json();

  return res.json(updatedUser);
}));

export default handler;