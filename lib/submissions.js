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
    'assets': 1,
    'subId': 1,
  }
  return role === 'admin' ? {...defaultFields,
    'eligible': 1, 
    'avgRating': 1,
    'myNotes': 1
  } : role === 'juror' ? {...defaultFields,
    'eligible': 1, 
    'myRating': 1,
    'myNotes': 1
  } : defaultFields;
};


export const getSubmissions = async ({ programId, _id, userId, role, sortBy, sortOrder }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('submissions');

  let query = {};
  if (_id) query._id = _id;
  if (programId) query.programId = programId;
  if (role !== 'juror' && role !== 'admin' && userId) query.userId = userId;
  if (role == 'juror') {
    query.submitted = true;
    query.eligible = true;
  }

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
      },
    },
    {
      '$lookup': {
        'from': 'assets', 
        'localField': '_id', 
        'foreignField': 'submissionId',
        'as': 'assets',
        'pipeline': [
          {
            '$project': {
              '_id': 0,
              'submissionId': 0,
            }
          }
        ]
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
          'localField': '_id', 
          'foreignField': 'submissionId',
          'as': 'ratings',
          'pipeline': [
            { '$match': {
                'userId': userId,
              }
            },
            { '$project': { 'rate': 1, 'scopes': 1, '_id': 0 } },
          ]
        }
      },
      {
        '$addFields': {
          'myRating': { '$first': '$ratings' },
        }
      },
      {
        '$lookup': {
          'from': 'notes',
          'localField': '_id', 
          'foreignField': 'submissionId',
          'as': 'notes',
          'pipeline': [
            { '$match': {
                'userId': userId,
              }
            },
            { '$project': { '_id': 0, 'content': 1 } },
          ]
        }
      },
      {
        '$addFields': {
          'myNotes': { '$first': '$notes' },
        }
      },
    ];
  }

  if (role === 'admin') {
    aggregate = [...aggregate,
      {
        '$lookup': {
          'from': 'ratings',
          'localField': '_id', 
          'foreignField': 'submissionId',
          'as': 'ratings',
          'pipeline': [
            { '$project': { 'rate': 1 } },
          ]
        }
      },
      {
        '$addFields': {
          'avgRating': { '$avg': '$ratings.rate' },
        }
      },
      {
        '$lookup': {
          'from': 'notes',
          'localField': '_id', 
          'foreignField': 'submissionId',
          'as': 'notes',
          // 'pipeline': [
          //   { '$project': { '_id': 0, 'content': 1 } },
          // ]
        }
      },
      {
        '$addFields': {
          'myNotes': { '$first': '$notes' },
        }
      },
    ];
  }

  aggregate = [...aggregate, { '$project': projection }];

  if (sortBy && sortOrder) {
    aggregate = [...aggregate, { '$sort': { [sortBy]: sortOrder === 'asc' ? 1 : -1 } }];
  }
  
  const submissions = await collection.aggregate(aggregate).toArray();
  return submissions;
};