import '../styles/article.css';
import cx from 'classnames';

export default function PostArticle({
  className,
  html,
}: {
  className?: string;
  html: string;
}) {
  try {
    // Will throw an error in server components
    if (typeof window !== 'undefined') {
      console.log('Running on client');
    } else {
      console.log('Running on server');
    }
  } catch (e) {
    console.error('Error determining environment', e);
  }
  return (
    <article
      className={cx('post break-words py-px', className)}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}
