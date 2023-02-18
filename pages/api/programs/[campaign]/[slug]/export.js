import nextConnect from 'next-connect';
// import slugify from 'slugify';
// import { ObjectId } from 'mongodb';
// import { connectToDatabase } from '../../../../../lib/mongodb';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';
import { getPrograms } from '../../../../../lib/programs';
import { getSubmissions } from '../../../../../lib/submissions';
import { getRole, isAdmin } from '../../../../../lib/users';
import { Parser } from 'json2csv';

const handler = nextConnect();

handler.get(withApiAuthRequired(async (req, res) => {
  const sessionUser = await getSession(req, res);
  const user = sessionUser ? sessionUser.user : null;
  if (!isAdmin(user)) {
    return res.status(403).send('You do not have permission');
  }
  
  const role = getRole(user);
  const { query: { campaign, slug } } = req;

  try {
    const programs = await getPrograms({ campaign, slug, role });
    const program = programs[0];

    const submissions = await getSubmissions({ programId: program.id, userId: user.sub, role, perPage:'999', pageNumber:'1', isPanel:false, filterFinalists: false });

    const structuredSubmissions = submissions.data.map((submission) => {
      // console.log(submission);
      const { user, assetsCount, eligible, avgRating, submitted, contacts } = submission;
      // const { name, email } = user;
      const contactsRow = contacts.map(contact => `${contact.name}, ${contact.email}`).join('\n')
      // const { rating, notes } = ratings[0];
      // console.log(submittedAt.toLocaleString())
      // const submittedAtFormatted = submittedAt.toLocaleString();
      return {
        // name,
        // email,
        contacts: contactsRow,
        assetsCount,
        // assets,
        eligible,
        avgRating,
        // myNotes,
        // finalist,
        submitted,
        // submittedAt: submittedAtFormatted,

        // rating,
        // notes,
      };
    });


    const fields = [
      // {label: 'Name', value:'name'},
      // {label: 'Email', value:'email'},
      {label: 'Contacts', value:'contacts'},
      {label: 'Assets Count', value:'assetsCount'},
      {label: 'Eligible', value:'eligible'},
      {label: 'Avg Rating', value:'avgRating'},
      {label: 'Submitted', value:'submitted'},
      // {label: 'Submitted At', value:'submittedAt'},
    ];
    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(structuredSubmissions);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=data.csv');
    res.send(csv)

    // res.status(200).send(submissions.data);
  } catch (error) {
    res.status(500).send(error);
  }
}));

export default handler;