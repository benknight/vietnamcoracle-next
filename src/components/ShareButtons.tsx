import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';
import useSWR from 'swr';
import resolveConfig from 'tailwindcss/resolveConfig';
import EmailIcon from '@material-ui/icons/AlternateEmail';
import FacebookIcon from '@material-ui/icons/Facebook';
import PinterestIcon from '@material-ui/icons/Pinterest';
import RedditIcon from '@material-ui/icons/Reddit';
import TwitterIcon from '@material-ui/icons/Twitter';
import tailwindConfig from '../../tailwind.config.js';
import breakpoints from '../config/breakpoints';
import cmsToNextUrls from '../lib/cmsToNextUrls';

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

interface Props {
  image: string;
  link: string;
  title: string;
}

const fetcher = (link: string) =>
  fetch(`/api/share-counts/?link=${encodeURIComponent(link)}`).then(res =>
    res.json(),
  );

export default function ShareButtons({ image, link, title }: Props) {
  const { data: shareCountData } = useSWR(cmsToNextUrls(link), fetcher);
  return (
    <>
      <style>{`
        main {
          display: flex;
          color: ${colors['white']};
          font-family: ${fontFamily.sans.join(',')};
          margin-bottom: ${margin[4]};
        }
        button {
          border-radius: ${borderRadius.DEFAULT};
          flex: 1 1 auto;
          font-size: ${fontSize['xs'][0]} !important;
          height: ${height[7]};
          margin: 0 ${margin[1]} ${margin[1]} 0;
        }
        button > span {
          align-items: center;
          display: flex;
          justify-content: center;
          padding: 0 ${padding[1]};
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
        @media (min-width: ${breakpoints.sm}) {
          button {
            flex: none;
          }
          button > span {
            padding: 0 ${padding[2]};
          }
        }
      `}</style>
      <main>
        <FacebookShareButton
          style={{ backgroundColor: '#1877f2' }}
          title={title}
          url={link}>
          <span>
            <FacebookIcon fontSize="small" />
            <span>Share</span>{' '}
            {shareCountData?.facebook > 0
              ? shareCountData.facebook.toLocaleString()
              : ''}
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
        <EmailShareButton
          body=""
          style={{ backgroundColor: backgroundColor.gray['500'] }}
          subject={title}
          url={link}>
          <span>
            <EmailIcon fontSize="small" />
            <span>Email</span>
          </span>
        </EmailShareButton>
      </main>
    </>
  );
}
