import nextConnect from 'next-connect';
import { connectToDatabase } from '../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import slugify from 'slugify';
import { getPrograms } from '../../../lib/programs';
import { getRole, isAdmin } from '../../../lib/users';

const handler = nextConnect();

handler.get(async (req, res) => {
  const sessionUser = await getSession(req, res);
  const user = sessionUser ? sessionUser.user : null;
  const role = getRole(user);

  try {
    const programs = await getPrograms({ role });
    res.status(200).send(programs);
  } catch (error) {
    res.status(500).send(error);
  }
});

handler.post(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  if (!isAdmin(user)) {
    return res.status(403).send('You do not have permission');
  }

  const { db } = await connectToDatabase();
  const { body } = req;

  body.createdAt = new Date();
  body.slug = slugify(body.title, { lower: true });

  const existingDoc = await db.collection('programs').findOne({ slug: body.slug });

  if (!existingDoc) {
    return db.collection('programs').insertOne(body, function(error, data) {
      if (error) res.status(500).send(error);
      db.collection('programs').findOne({ _id: data.insertedId }, { __v: false }, function(error, program) {
        if (error) res.status(500).send(error);
        res.status(201).send(program);
      });
    });
  } else {
    return res.status(400).send('Program already exists');
  }
}));

export default handler;