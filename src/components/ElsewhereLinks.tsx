import Tooltip from '@material-ui/core/Tooltip';
import EmailIcon from '@material-ui/icons/AlternateEmail';
import FacebookIcon from '@material-ui/icons/Facebook';
// import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';
import YouTubeIcon from '@material-ui/icons/YouTube';

export default function ElsewhereLinks({ useBrandColors = false }) {
  return (
    <div className="flex items-center justify-center text-gray-400">
      <a href="https://www.facebook.com/vietnamcoracle">
        <Tooltip
          title="Vietnam Coracle on Facebook"
          aria-label="Vietnam Coracle on Facebook"
          arrow>
          <FacebookIcon
            classes={{ root: 'w-8 h-8' }}
            style={useBrandColors ? { color: '#3b5998' } : {}}
          />
        </Tooltip>
      </a>
      {/* <a className="ml-2" href="https://www.instagram.com/vietnamcoracle">
        <Tooltip
          title="Vietnam Coracle on Instagram"
          aria-label="Vietnam Coracle on Instagram"
          arrow>
          <InstagramIcon
            classes={{ root: 'w-8 h-8' }}
            style={useBrandColors ? { color: '#E1306C' } : {}}
          />
        </Tooltip>
      </a> */}
      <a className="ml-2" href="https://twitter.com/VietnamCoracle">
        <Tooltip
          title="Vietnam Coracle on Twitter"
          aria-label="Vietnam Coracle on Twitter"
          arrow>
          <TwitterIcon
            classes={{ root: 'w-8 h-8' }}
            style={useBrandColors ? { color: '#1da1f2' } : {}}
          />
        </Tooltip>
      </a>
      <a className="ml-2" href="https://www.facebook.com/vietnamcoracle">
        <Tooltip
          title="Vietnam Coracle on YouTube"
          aria-label="Vietnam Coracle on YouTube"
          arrow>
          <YouTubeIcon
            classes={{ root: 'w-8 h-8' }}
            style={useBrandColors ? { color: '#c4302b' } : {}}
          />
        </Tooltip>
      </a>
      <a className="ml-2" href="mailto:vietnamcoracle@gmail.com">
        <Tooltip
          title="Email Vietnam Coracle"
          aria-label="Email Vietnam Coracle"
          arrow>
          <EmailIcon classes={{ root: 'w-8 h-8' }} />
        </Tooltip>
      </a>
    </div>
  );
}
