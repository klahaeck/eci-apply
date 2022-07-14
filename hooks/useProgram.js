import useSWR from 'swr';
import fetcher from '../lib/fetcher';

export default function useProgram({ campaign, slug }) {
  const { mutate, data: program, error } = useSWR(campaign && slug ? `/api/programs/${campaign}/${slug}` : null, fetcher);
  return { mutate, program, error };
}

