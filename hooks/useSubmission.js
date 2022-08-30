import useSWR from 'swr';
import fetcher from '../lib/fetcher';

export default function useSubmission({ programId, submissionId }) {
  const fetchUrl = programId ? ['/api/submissions/apply', { programId }] : submissionId ? `/api/submissions/${submissionId}` : null;

  const { mutate, data: submission, error } = useSWR(fetchUrl, fetcher);

  return { mutate, submission, error };
}

