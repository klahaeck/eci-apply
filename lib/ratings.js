import { connectToDatabase } from './mongodb';

// const getProjection = (role) => {
//   return role === 'admin' || role === 'juror' ? {
//     'slug': 1, 
//     'title': 1, 
//     'jurors': 1, 
//     'jurorInfo': 1, 
//     'questions': 1, 
//     'campaign': 1, 
//     'guidelines': 1, 
//     'description': 1, 
//     'confirmationEmail': 1, 
//     'published': 1, 
//     'updatedAt': 1, 
//     'startDate': 1, 
//     'endDate': 1, 
//     'createdAt': 1, 
//     'submissionsCount': 1,
//     'ratingScopes': 1
//   } : {
//     'campaign': 1,
//     'title': 1,
//     'slug': 1,
//     'description': 1,
//     'guidelines': 1,
//     'startDate': 1,
//     'endDate': 1,
//     'questions': 1
//   };
// };

export const getRatings = async ({ role }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('ratings');

  // const query = {};

  // const projection = getProjection(role);

  const aggregate = [
    {
      '$set': {
        'programId': {
          '$toString': '$_id'
        }
      }
    },
    {
      '$lookup': {
        'from': 'ratings', 
        'localField': 'programId', 
        'foreignField': 'programId', 
        'as': 'submissions'
      }
    },
    {
      '$set': {
        'submissionsCount': {
          '$size': '$submissions'
        }
      }
    },
    {
      '$project': projection
    }
  ];
  
  const programs = role === 'admin' || role === 'juror' ? await collection.aggregate(aggregate).toArray() : await collection.find(query).project(projection).toArray();

  return programs;
};

export const getProgram = async ({ campaign, slug, role }) => {
  const { db } = await connectToDatabase();
  const collection = db.collection('programs');

  const query = { campaign, slug: slug.trim().toLowerCase() };

  const projection = getProjection(role);

  const aggregate = [
    {
      '$match': query
    },
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
      '$set': {
        'submissionsCount': {
          '$size': '$submissions'
        }
      }
    },
    {
      '$project': projection
    }
  ];

  let program;
  if (role === 'admin' || role === 'juror') {
    const programs = await collection.aggregate(aggregate).toArray();
    program = programs[0];
  } else {
    program = await collection.findOne(query).project(projection);
  }
  
  return program;
};

