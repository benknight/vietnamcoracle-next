import cx from 'classnames';
import About from './About';
import Subscribe from './Subscribe';
import Support from './Support';
import SlidingSticky from './SlidingSticky';
import type { BlockData } from './Block';

interface Props {
  className?: string;
  blocks: {
    about: {
      block: BlockData;
    };
    subscribe: {
      block: BlockData;
    };
    support: {
      block: BlockData;
    };
  };
}

const SidebarDefault = ({ className = '', blocks }: Props) => {
  return (
    <SlidingSticky>
      <div className={cx('py-10 xl:pt-0', className)}>
        <About data={blocks.about.block} />
        <Subscribe data={blocks.subscribe.block} />
        <Support data={blocks.support.block} />
      </div>
    </SlidingSticky>
  );
};

export default SidebarDefault;
