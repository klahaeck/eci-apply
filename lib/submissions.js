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
    'myNotes': 1,
    'finalist': 1,
  } : role === 'juror' ? {...defaultFields,
    'eligible': 1,
    'ratings': 1,
    'myNotes': 1
  } : defaultFields;
};


export const getSubmissions = async ({ programId, _id, userId, role, searchQuery, sortBy, sortOrder, perPage, pageNumber, isPanel }) => {
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
  if (isPanel) query.finalist = true;

  const projection = getProjection(role)

  let aggregate = [];

  if (searchQuery) {
    aggregate = [...aggregate,
      {
        $search: {
          index: 'default',
          text: {
            query: searchQuery,
            path: {
              'wildcard': '*'
            }
          }
        }
      }
    ];
  }

  aggregate = [...aggregate,
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
            '$sort': { 'position': 1 }
          },
          {
            '$project': {
              '_id': 1,
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
            { '$project': { '_id': 0, 'round': 1, 'rate': 1, 'scopes': 1 } }
          ]
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

  aggregate = [...aggregate, { '$project': projection }];
  const sort = { createdAt: -1, submittedAt: -1};
  if (sortBy && sortOrder) {
    sortBy = sortBy === 'myRating' ? 'ratings.rate' : sortBy;
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  }
  aggregate = [...aggregate, { '$sort': sort }];

  if (perPage && pageNumber) {
    aggregate = [...aggregate,
      {
        '$facet': {
          metadata: [
            { '$count': 'total' },
            { '$addFields': { page: parseInt(pageNumber) } },
            { '$addFields': { perPage: parseInt(perPage) } },
            { '$addFields': { totalPages: { $ceil: { $divide: ['$total', '$perPage'] } } } },
          ],
          data: [
            { '$skip': (parseInt(pageNumber) - 1) * parseInt(perPage) },
            { '$limit': parseInt(perPage) }
          ]
        }
      },
      {
        $project: {
          total: { $arrayElemAt: [ '$metadata.total', 0 ] },
          perPage: { $arrayElemAt: [ '$metadata.perPage', 0 ] },
          totalPages: { $arrayElemAt: [ '$metadata.totalPages', 0 ] },
          page: { $arrayElemAt: [ '$metadata.page', 0 ] },
          data: 1,
        }
      }
    ];
  }
  
  const submissions = await collection.aggregate(aggregate).toArray();
  return submissions[0]?.data ? submissions[0] : submissions;
};