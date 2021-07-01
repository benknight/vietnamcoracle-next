import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';
import resolveConfig from 'tailwindcss/resolveConfig';
import EmailIcon from '@material-ui/icons/AlternateEmail';
import FacebookIcon from '@material-ui/icons/Facebook';
import PinterestIcon from '@material-ui/icons/Pinterest';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';
import tailwindConfig from '../../tailwind.config.js';

const {
  theme: {
    backgroundColor,
    borderRadius,
    colors,
    fontFamily,
    fontSize,
    height,
    margin,
    padding,
    width,
  },
} = resolveConfig(tailwindConfig);

// console.log(resolveConfig(tailwindConfig));

export default function ShareButtons({
  image = '',
  link = '',
  title = '',
  fbShareCount = 0,
}) {
  return (
    <>
      <style>{`
        div {
          color: ${colors['white']};
          font-family: ${fontFamily.sans.join(',')};
        }
        button {
          border-radius: ${borderRadius.DEFAULT};
          font-size: ${fontSize['xs'][0]} !important;
          height: ${height[7]};
          margin: 0 ${margin[1]} ${margin[2]} 0;
        }
        button > span {
          align-items: center;
          display: flex;
          padding: 0 ${padding[2]};
        }
        button > span > span {
          margin: 0 ${margin[1]};
          align-items: center;
        }
        button > span > svg {
          height: ${height[4]};
          fill: currentColor;
          width: ${width[4]};
        }
        button.email {
          background-color: ${backgroundColor.gray['500']} !important;
        }
      `}</style>
      <div>
        <FacebookShareButton
          style={{ backgroundColor: '#1877f2' }}
          title={title}
          url={link}>
          <span>
            <FacebookIcon fontSize="small" />
            <span>Share</span>{' '}
            {fbShareCount > 0 ? fbShareCount.toLocaleString() : ''}
          </span>
        </FacebookShareButton>
        <TwitterShareButton
          style={{ backgroundColor: '#1da1f2' }}
          title={title}
          url={link}>
          <span>
            <TwitterIcon fontSize="small" />
            <span>Tweet</span>
          </span>
        </TwitterShareButton>
        <PinterestShareButton
          media={image}
          style={{ backgroundColor: '#e60023' }}
          title={title}
          url={link}>
          <span>
            <PinterestIcon />
            <span>Pin</span>
          </span>
        </PinterestShareButton>
        <RedditShareButton
          style={{ backgroundColor: '#ff4500' }}
          title={title}
          url={link}>
          <span>
            <RedditIcon style={{ position: 'relative', top: '-1px' }} />
            <span>Share</span>
          </span>
        </RedditShareButton>
        <EmailShareButton body="" className="email" subject={title} url={link}>
          <span>
            <EmailIcon fontSize="small" />
            <span>Email</span>
          </span>
        </EmailShareButton>
      </div>
    </>
  );
}
