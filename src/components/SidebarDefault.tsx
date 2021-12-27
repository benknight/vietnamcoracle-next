import cx from 'classnames';
import About from './About';
import Subscribe from './Subscribe';
import Support from './Support';
import SlidingSticky from './SlidingSticky';

const SidebarDefault = ({ className = '', data }) => (
  <SlidingSticky>
    <div className={cx('pt-4 pb-10', className)}>
      <About data={data.about.block} />
      <Subscribe data={data.subscribe.block} />
      <Support data={data.support.block} />
    </div>
  </SlidingSticky>
);

export default SidebarDefault;
