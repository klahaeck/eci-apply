import nextConnect from 'next-connect';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { isAdmin } from '../../../lib/users';
import { upload } from '../../../lib/aws';
// import { defaultSubmission } from '../../../data';
// import { getSubmissions } from '../../../lib/submissions';
import multipartFormParser from  '../../../middleware/multipart-form-parser';
const sizeOf = require('image-size');

const handler = nextConnect();
handler.use(multipartFormParser);

handler.post(withApiAuthRequired(async (req, res) => {
  const user = await getSession(req, res).user;
  const { body, file } = req;

  if (!isAdmin(user) && user.sub !== body.userId) {
    return res.status(403).send('You do not have permission');
  }

  const now = new Date();

  if (file) {
    const { width, height } = sizeOf(file.filepath);
    body.imageWidth = width;
    body.imageHeight = height;

    const { location, key } = await upload(now, file);
    body.imageURL = location;
    body.imageKey = key;
  }

  body.createdAt = now;
  body.updatedAt = now;
  body.submissionId = ObjectId(body.submissionId);

  const { db } = await connectToDatabase();
  
  await db.collection('assets').insertOne(body);
  // const updatedDocument = await db.collection('assets').findOne({ _id: document.insertedId });
  return res.status(200).send();
}));

export default handler;

export const config = {
  api: {
    bodyParser: false
  }
}