import { connectToDatabase } from './mongodb';

const getProjection = (role) => {
  const defaultFields = {
    'campaign': 1,
    'title': 1,
    'slug': 1,
    'description': 1,
    'guidelines': 1,
    'startDate': 1,
    'endDate': 1,
    'questions': 1,
  }
  return role === 'admin' || role === 'juror' ? {...defaultFields,
    'jurors': 1, 
    'jurorInfo': 1,
    'minWorkAssets': 1,
    'maxWorkAssets': 1,
    'confirmationEmail': 1, 
    'published': 1, 
    'updatedAt': 1, 
    'createdAt': 1, 
    'submissionsCount': 1,
    'ratingScopes': 1,
    'ratingRound': 1,
    'panelActive': 1,
  } : defaultFields;
};

export const getPrograms = async ({ campaign, slug, role }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('programs');

  let aggregate = [];
  const projection = getProjection(role);

  if (campaign && slug) {
    aggregate = [...aggregate, {
      '$match': { campaign, slug: slug.trim().toLowerCase() }
    }];
  }

  if (role === 'admin' || role === 'juror') {
    aggregate = [...aggregate,
      {
        '$set': {
          'programId': {
            '$toString': '$_id'
          }
        }
      },
      {
        '$lookup': {
          'from': 'submissions', 
          'localField': 'programId', 
          'foreignField': 'programId', 
          'as': 'submissions'
        }
      },
      {
        '$addFields': {
          'submissionsCount': {
            '$size': '$submissions'
          }
        }
      }
    ];
  }

  aggregate = [...aggregate, {
    '$project': projection
  }];  
  
  const programs = await collection.aggregate(aggregate).toArray();
  return programs;
};
