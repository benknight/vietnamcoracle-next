import useNavCategory from '../lib/useNavCategory';

export default function PostLink({ slug, ...props }) {
  const navCategory = useNavCategory();
  return (
    <a
      href={`/${slug}/${navCategory ? `?ref=${navCategory}` : ''}`}
      {...props}
    />
  );
}
