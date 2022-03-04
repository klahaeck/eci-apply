import nextConnect from 'next-connect';
import slugify from 'slugify';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getProgram } from '../../../../../lib/programs';
import { isAdmin, isJuror } from '../../../../../lib/utils';

const handler = nextConnect();

handler.get(async (req, res) => {
  const user = await getSession(req, res).user;
  const { query: { campaign, slug } } = req;

  try {
    const program = await getProgram({ campaign, slug, role: isAdmin(user) ? 'admin' : isJuror(user) ? 'juror' : null });
    res.status(200).send(program);
  } catch (error) {
    res.status(500).send(error);
  }
});

handler.put(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  if (!isAdmin(user)) {
    return res.status(403).send('You do not have permission');
  }

  const { db } = await connectToDatabase();
  const { body } = req;
  const _id = body._id;

  delete body._id;
  delete body.createdAt;

  body.updatedAt = new Date();
  body.slug = slugify(body.title, { lower: true });

  console.log(body);

  const updated = await db.collection('programs').updateOne({ _id: new ObjectId(_id) }, { $set: {...body} });

  console.log(updated);

  return res.status(200).send('ok');
}));

export default handler;