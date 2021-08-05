import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function useCategoryRef() {
  const router = useRouter();
  const ref = useMemo(
    () =>
      router.pathname === '/browse/[[...browse]]'
        ? router.query.browse[0]
        : null,
    [router.pathname],
  );
  return ref;
}
