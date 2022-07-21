import { ObjectId } from 'mongodb';
import { connectToDatabase } from './mongodb';

const getProjection = (role) => {
  const defaultFields = {
    '_id': 1,
    'submissionId': 1, 
    'userId': 1, 
    'scopes': 1,
    'rate': 1
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

export const getRatings = async ({ submissionId, userId, role }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('ratings');

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
  
  const ratings = await collection.aggregate(aggregate).toArray();

  return ratings[0] || {};
};

export const calculateRate = (scopes) => parseFloat(scopes.reduce((accumulator, scope) => accumulator + (parseFloat(scope.value) * (parseFloat(scope.weight) / 100)), 0).toFixed(3));