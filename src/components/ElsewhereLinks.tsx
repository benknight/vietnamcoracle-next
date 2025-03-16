import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/AlternateEmail';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function ElsewhereLinks({ useBrandColors = false }) {
  return (
    <section>
      <h1 className="text-sm uppsercase tracking-widest text-center font-display mb-4 font-light">
        Follow &amp; Connect
      </h1>
      <div className="flex items-center justify-center text-gray-600 dark:text-gray-400">
        <a href="https://www.facebook.com/vietnamcoracle">
          <Tooltip
            title="Vietnam Coracle on Facebook"
            aria-label="Vietnam Coracle on Facebook"
            arrow>
            <FacebookIcon
              classes={{ root: '!w-6 !h-6' }}
              style={useBrandColors ? { color: '#3b5998' } : {}}
            />
          </Tooltip>
        </a>
        <a className="ml-3" href="https://www.instagram.com/vietnamcoracle">
          <Tooltip
            title="Vietnam Coracle on Instagram"
            aria-label="Vietnam Coracle on Instagram"
            arrow>
            <InstagramIcon
              classes={{ root: '!w-6 !h-6' }}
              style={useBrandColors ? { color: '#E1306C' } : {}}
            />
          </Tooltip>
        </a>
        <a className="ml-3" href="https://twitter.com/VietnamCoracle">
          <Tooltip
            title="Vietnam Coracle on Twitter"
            aria-label="Vietnam Coracle on Twitter"
            arrow>
            <TwitterIcon
              classes={{ root: '!w-6 !h-6' }}
              style={useBrandColors ? { color: '#1da1f2' } : {}}
            />
          </Tooltip>
        </a>
        <a className="ml-3" href="https://www.youtube.com/c/Vietnamcoracle">
          <Tooltip
            title="Vietnam Coracle on YouTube"
            aria-label="Vietnam Coracle on YouTube"
            arrow>
            <YouTubeIcon
              classes={{ root: '!w-6 !h-6' }}
              style={useBrandColors ? { color: '#c4302b' } : {}}
            />
          </Tooltip>
        </a>
        <a className="ml-3" href="mailto:vietnamcoracle@gmail.com">
          <Tooltip
            title="Email Vietnam Coracle"
            aria-label="Email Vietnam Coracle"
            arrow>
            <EmailIcon classes={{ root: '!w-6 !h-6' }} />
          </Tooltip>
        </a>
        <a className="ml-3" href="https://cms.vietnamcoracle.com/feed">
          <Tooltip title="RSS Feed" aria-label="RSS Feed" arrow>
            <RssFeedIcon classes={{ root: '!w-6 !h-6' }} />
          </Tooltip>
        </a>
      </div>
    </section>
  );
}
