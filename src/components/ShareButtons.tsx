import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';
import EmailIcon from '@material-ui/icons/AlternateEmail';
import FacebookIcon from '@material-ui/icons/Facebook';
import PinterestIcon from '@material-ui/icons/Pinterest';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';

export default function ShareButtons({
  image = '',
  link = '',
  title = '',
  fbShareCount = 0,
}) {
  return (
    <div className="flex flex-wrap text-white mt-8 dark:mt-0">
      <FacebookShareButton
        className="rounded mr-1 mb-2 !text-xs !leading-loose"
        style={{ backgroundColor: '#1877f2' }}
        title={title}
        url={link}>
        <span className="flex items-center px-2">
          <FacebookIcon className="w-4 h-4" fontSize="small" />
          <span className="mx-1 font-medium">Share</span>{' '}
          {fbShareCount > 0 ? fbShareCount.toLocaleString() : ''}
        </span>
      </FacebookShareButton>
      <TwitterShareButton
        className="rounded mr-1 mb-2 !text-xs !leading-loose"
        style={{ backgroundColor: '#1da1f2' }}
        title={title}
        url={link}>
        <span className="flex items-center px-2 font-medium">
          <TwitterIcon className="w-4 h-4" fontSize="small" />
          <span className="ml-1">Tweet</span>
        </span>
      </TwitterShareButton>
      <PinterestShareButton
        className="rounded mr-1 mb-2 !text-xs !leading-loose"
        media={image}
        style={{ backgroundColor: '#e60023' }}
        title={title}
        url={link}>
        <span className="flex items-center px-2 font-medium">
          <PinterestIcon className="w-4 h-4" />
          <span className="ml-1">Pin</span>
        </span>
      </PinterestShareButton>
      <RedditShareButton
        className="rounded mr-1 mb-2 !text-xs !leading-loose"
        style={{ backgroundColor: '#ff4500' }}
        title={title}
        url={link}>
        <span className="flex items-center px-2 font-medium">
          <RedditIcon className="relative w-4 h-4 top-[-1px]" />
          <span className="ml-1">Share</span>
        </span>
      </RedditShareButton>
      <EmailShareButton
        body=""
        className="rounded mr-1 mb-2 !text-xs !leading-loose"
        subject={title}
        url={link}>
        <span className="rounded bg-gray-500 flex items-center px-2 font-medium">
          <EmailIcon className="w-4 h-4" fontSize="small" />
          <span className="ml-1">Email</span>
        </span>
      </EmailShareButton>
    </div>
  );
}
