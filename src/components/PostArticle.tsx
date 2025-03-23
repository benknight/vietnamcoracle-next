import '../styles/article.css';
import cx from 'classnames';

export default function PostArticle({
  className,
  html,
}: {
  className?: string;
  html: string;
}) {
  return (
    <article
      className={cx('post break-words py-px', className)}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
