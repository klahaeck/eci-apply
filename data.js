export const meta = {
  copyright: 'Midway Contemporary Art',
  title: 'Visual Arts Fund',
  socialTitle: 'Visual Arts Fund',
  keywords: 'visual, arts, fund',
  description: 'Visual Arts Fund',
  imageUrl: 'https://cryptowords.s3.amazonaws.com/production/social-share.png',
  path: '/',
  url: 'https://vaf.midwayart.org'
};

export const campaigns = [
  { label: 'VAF', value: 'vaf' },
  { label: 'Relief', value: 'relief' }
];

export const defaultQuestion = {
  // _id: '',
  question: '',
  placeholder: '',
  helperText: '',
  validations: {
    required: true,
    minWords: 100,
    maxWords: 500
  }
};

export const defaultProgram = {
  title: '',
  startDate: '',
  endDate: '',
  campaign: 'vaf',
  published: false,
  jurors: [],
  description: '',
  quidelines: '',
  jurorInfo: '',
  confirmationEmail: '',
  questions: []
};

export const defaultProfile = {
  user_metadata: {
    phone_number: '',
    address0: '',
    address1: '',
    city: '',
    state: '',
    zip: '',
    county: '',
  }
};

export const defaultSubmission = {
  createdBy: '',
  leadOrganizer: {
    // USER INFO HERE
  },
  title: '',
  startDate: '',
  completionDate: '',
  budgetTotal: 0,
  budgetRequested: 0,
  summary: '',
  details: [],
  bios: [],
  assets: [],
  budget: {
    expenses: [],
    income: [],
    notes: ''
  },
  // notes: [],
  // ratings: [],
  eligible: true,
  submitted: false,
};

export const defaultBio = {
  name: '',
  bio: ''
};

export const states = [
  { value: 'AK', label: 'Alaska' },
  { value: 'TX', label: 'Texas' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DC', label: 'DistrictofColumbia' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'IA', label: 'Iowa' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MD', label: 'Maryland' },
  { value: 'ME', label: 'Maine' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MT', label: 'Montana' },
  { value: 'NC', label: 'NorthCarolina' },
  { value: 'ND', label: 'NorthDakota' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NH', label: 'NewHampshire' },
  { value: 'NJ', label: 'NewJersey' },
  { value: 'NM', label: 'NewMexico' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NY', label: 'NewYork' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'RhodeIsland' },
  { value: 'SC', label: 'SouthCarolina' },
  { value: 'SD', label: 'SouthDakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VA', label: 'Virginia' },
  { value: 'VT', label: 'Vermont' },
  { value: 'WA', label: 'Washington' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WV', label: 'WestVirginia' },
  { value: 'WY', label: 'Wyoming' }
];
