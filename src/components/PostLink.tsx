import Link from 'next/link';
import useCategoryRef from '../lib/useCategoryRef';

export default function PostLink({ post, ...props }) {
  const ref = useCategoryRef();
  return <Link href={`/${post.slug}${ref && `?ref=${ref}`}`} {...props} />;
}
