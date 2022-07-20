import useSWR from 'swr';

const fetcher = path => fetch(path).then(res => res.json());

export default function useAPI(path) {
  const { data, error } = useSWR(path, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return { data, error };
}
