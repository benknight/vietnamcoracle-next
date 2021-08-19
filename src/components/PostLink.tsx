import useCategoryRef from '../lib/useCategoryRef';

export default function PostLink({ post, ...props }) {
  const ref = useCategoryRef();
  return <a href={`/${post.slug}${ref ? `?ref=${ref}` : ''}`} {...props} />;
}
