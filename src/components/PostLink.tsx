import { AnchorHTMLAttributes } from 'react';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  navCategory?: string;
  slug: string;
}

export default function PostLink({ navCategory, slug, ...linkProps }: Props) {
  return (
    <a
      href={`/${slug}/${navCategory ? `?ref=${navCategory}` : ''}`}
      {...linkProps}
    />
  );
}
