import useNavCategory from '../lib/useNavCategory';

export default function PostLink({ post, ...props }) {
  const navCategory = useNavCategory();
  return (
    <a
      href={`/${post.slug}/${navCategory ? `?ref=${navCategory}` : ''}`}
      {...props}
    />
  );
}
