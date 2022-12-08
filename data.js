export const meta = {
  copyright: 'Emerging Curators Institute',
  title: 'ECI - Apply',
  socialTitle: 'ECI - Apply',
  keywords: 'emerging, curators, institute, fellowship',
  description: 'The Emerging Curators Institute is designed to build the individual practices of emerging curators from diverse backgrounds through an in-depth research, professional development, and presentation program.',
  imageUrl: 'https://eciapply.s3.amazonaws.com/eci-share-logo.png',
  path: '/',
  url: 'https://apply.emergingcurators.org'
};

export const campaigns = [ 'Fellowship' ];

export const jurorSettings = {
  maxRating: 10,
};

// export const defaultQuestion = {
//   question: '',
//   placeholder: '',
//   helperText: '',
//   validations: {
//     required: true,
//     minWords: 100,
//     maxWords: 500
//   }
// };

export const defaultProgram = {
  title: '',
  startDate: new Date('2023-01-01T00:00:00.000-08:00'),
  endDate: new Date('2023-01-01T00:00:00.000-08:00'),
  campaign: 'fellowship',
  published: false,
  jurors: [],
  description: '',
  quidelines: '',
  jurorInfo: '',
  confirmationEmail: '',
  questions: [],
  ratingRound: 1,
  panelActive: false,
  ratingScopes: [
    { id: 0, attribute: 'overall', weight: 100 }
  ]
};

export const defaultScope = {
  attribute: '',
  weight: 0
};

export const defaultProfile = {
  user_metadata: {
    phone_number: '',
    address0: '',
    address1: '',
    city: '',
    state: '',
    zip: '',
    // county: '',
  }
};

export const defaultAsset = {
  type: '',
  title: '',
  artist: '',
  year: '',
  description: ''
};

export const defaultSubmission = {
  programId: null,
  user: {
    id: '',
    email: ''
  },
  contacts: [],
  // title: '',
  // startDate: new Date('2023-01-01T00:00:00.000-08:00'),
  // completionDate: new Date('2023-02-01T00:00:00.000-08:00'),
  // budgetTotal: 0,
  // budgetRequested: 5000,
  resume: '',
  statement: '',
  proposal: '',
  // details: [],
  // bios: [],
  // budget: {
  //   expenses: [],
  //   income: [],
  //   notes: ''
  // },
  eligible: true,
  submitted: false,
  finalist: false,
};

// export const grantAmounts = [
//   { label: '$5,000', value: 5000 },
// ];

export const defaultBio = {
  name: '',
  bio: ''
};

export const states = [
  { label: 'Alaska', value: 'AK' },
  { label: 'Texas', value: 'TX' },
  { label: 'Alabama', value: 'AL' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'District of Columbia', value: 'DC' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Maine', value: 'ME' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Montana', value: 'MT' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New York', value: 'NY' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Washington', value: 'WA' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wyoming', value: 'WY' }
];
