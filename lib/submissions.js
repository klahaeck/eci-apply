import { connectToDatabase } from './mongodb';

const getProjection = (role) => {
  const defaultFields = {
    'bios': 1, 
    'budget': 1, 
    'budgetRequested': 1, 
    'budgetTotal': 1, 
    'completionDate': 1, 
    'contacts': 1, 
    'createdAt': 1, 
    'details': 1, 
    'programId': 1, 
    'startDate': 1, 
    'submitted': 1, 
    'summary': 1, 
    'title': 1, 
    'updatedAt': 1,
    'user': 1,
    'userId': 1,
    'assetsCount': 1,
    'assets': 1
  }
  return role === 'admin' ? {...defaultFields,
    'eligible': 1, 
    'avgRating': 1
  } : role === 'juror' ? {...defaultFields,
    'eligible': 1, 
    'myRating': 1,
  } : defaultFields;
};


export const getSubmissions = async ({ programId, _id, userId, role, sortBy, sortOrder }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('submissions');

  let query = {};
  if (programId) query.programId = programId;
  if (_id) query._id = _id;
  if (programId) query.programId = programId;
  if (userId) query.userId = userId;

  const projection = getProjection(role)

  let aggregate = [
    {
      '$match': query
    },
    {
      '$set': {
        'submissionId': {
          '$toString': '$_id'
        }
      }
    },
    {
      '$lookup': {
        'from': 'assets', 
        'localField': '_id', 
        'foreignField': 'submissionId', 
        'as': 'assets'
      }
    },
    {
      '$set': {
        'assetsCount': {
          '$size': '$assets'
        }
      }
    }
  ];

  if (role === 'juror') {
    aggregate = [...aggregate,
      {
        '$lookup': {
          'from': 'ratings', 
          'pipeline': [
            { '$match':
                { '$expr':
                  { '$and':
                      [
                        { '$eq': [ '$submissionId',  '$submissionId' ] },
                        { '$eq': [ '$userId', userId ] }
                      ]
                  }
                }
            },
            { '$project': { 'ratingTotal': 1 } }
          ],
          'as': 'myRating'
        }
      },
      {
        '$set': {
          'myRating': { '$getField': { 'field': 'ratingTotal', 'input': { '$arrayElemAt': [ '$myRating', 0 ] } } }
        }
      }
    ];
  }

  if (role === 'admin') {
    aggregate = [...aggregate,
      {
        '$lookup': {
          'from': 'ratings', 
          'pipeline': [
            { '$match':
              { '$expr': {
                  '$eq': [ '$submissionId',  '$submissionId' ]
                },
              }
            },
            { '$project': { 'ratingTotal': 1 } }
          ],
          'as': 'allRatings'
        }
      },
      {
        '$set': {
          'avgRating': { $avg: '$allRatings.ratingTotal' }
        }
      }
    ];
  }

  aggregate = [...aggregate, { '$project': projection }];

  if (sortBy && sortOrder) {
    aggregate = [...aggregate, { '$sort': { [sortBy]: sortOrder === 'asc' ? 1 : -1 } }];
  }
  
  const submissions = await collection.aggregate(aggregate).toArray();
  return submissions;
};