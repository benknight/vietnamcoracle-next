import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';
import useSWR from 'swr';
import resolveConfig from 'tailwindcss/resolveConfig';
import EmailIcon from '@mui/icons-material/AlternateEmail';
import FacebookIcon from '@mui/icons-material/Facebook';
import PinterestIcon from '@mui/icons-material/Pinterest';
import RedditIcon from '@mui/icons-material/Reddit';
import TwitterIcon from '@mui/icons-material/Twitter';
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
} = resolveConfig(tailwindConfig) as any;

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
        }
        button {
          border-width: 1px !important;
          border-style: solid !important;
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
        .fb {
          background-color: #1877f2 !important;
          border-color: #1877f2 !important;
        }
        .tw {
          background-color: #1da1f2 !important;
          border-color: #1da1f2 !important;
        }
        .pt {
          background-color: #e60023 !important;
          border-color: #e60023 !important;
        }
        .rd {
          background-color: #ff4500 !important;
          border-color: #ff4500 !important;
        }
        .em {
          background-color: ${backgroundColor.gray['500']} !important;
          border-color: ${backgroundColor.gray['500']} !important;
        }
        @media (prefers-color-scheme: dark) {
          .fb {
            background-color: #1877f280 !important;
            border-color: #1877f2 !important;
          }
          .tw {
            background-color: #1da1f280 !important;
            border-color: #1da1f2 !important;
          }
          .pt {
            background-color: #e6002380 !important;
            border-color: #e60023 !important;
          }
          .rd {
            background-color: #ff450080 !important;
            border-color: #ff4500 !important;
          }
          .em {
            background-color: ${backgroundColor.gray['500']}80 !important;
            border-color: ${backgroundColor.gray['500']} !important;
          }
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
          className="fb"
          title={title}
          type="button"
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
          className="tw"
          title={title}
          type="button"
          url={link}>
          <span>
            <TwitterIcon fontSize="small" />
            <span>Tweet</span>
          </span>
        </TwitterShareButton>
        <PinterestShareButton
          className="pt"
          media={image}
          title={title}
          type="button"
          url={link}>
          <span>
            <PinterestIcon />
            <span>Pin</span>
          </span>
        </PinterestShareButton>
        <RedditShareButton
          className="rd"
          title={title}
          type="button"
          url={link}>
          <span>
            <RedditIcon style={{ position: 'relative', top: '-1px' }} />
            <span>Post</span>
          </span>
        </RedditShareButton>
        <EmailShareButton
          body=""
          className="em"
          subject={title}
          type="button"
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
