import { ObjectId } from 'mongodb';
import { connectToDatabase } from './mongodb';

const getProjection = (role) => {
  const defaultFields = {
    '_id': 1,
    'submissionId': 1, 
    'userId': 1, 
    'content': 1,
  }
  return role === 'admin' ? {...defaultFields,
    // 'eligible': 1, 
    // 'avgRating': 1,
    // 'allRatings': 1,
  } : role === 'juror' ? {...defaultFields,
    // 'eligible': 1, 
    // 'myRating': 1,
  } : defaultFields;
};

export const getNotes = async ({ submissionId, userId, role }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('notes');

  let query = {};
  if (submissionId) query.submissionId = ObjectId(submissionId);
  if (userId) query.userId = userId;

  const projection = getProjection(role)

  const aggregate = [
    {
      '$match': query
    },
    {
      '$project': projection
    }
  ];
  
  const notes = await collection.aggregate(aggregate).toArray();

  return notes[0] || {};
};