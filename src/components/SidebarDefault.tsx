import cx from 'classnames';
import useAPI from '../lib/useAPI';
import About from './About';
import Subscribe from './Subscribe';
import Support from './Support';
import SlidingSticky from './SlidingSticky';

const SidebarDefault = ({ className = '' }) => {
  const { data } = useAPI('/api/blocks/');
  if (!data) return null;
  return (
    <SlidingSticky>
      <div className={cx('py-10', className)}>
        <About data={data.about.block} />
        <Subscribe data={data.subscribe.block} />
        <Support data={data.support.block} />
      </div>
    </SlidingSticky>
  );
};

export default SidebarDefault;
