import cx from 'classnames';
import { gql } from 'graphql-request';
import About from './About';
import Block from './Block';
import Subscribe from './Subscribe';
import Support from './Support';
import SlidingSticky from './SlidingSticky';

const SidebarDefault = ({ className = '', data }) => (
  <SlidingSticky>
    <div className={cx('py-8 dark:xl:bg-gray-950', className)}>
      <About data={data.about.block} />
      <Support data={data.support.block} />
      <Subscribe data={data.subscribe.block} />
    </div>
  </SlidingSticky>
);

SidebarDefault.fragments = gql`
  fragment SidebarDefaultData on RootQuery {
    about: block(id: "cG9zdDozNjExOA==", asPreview: $preview) {
      ...Block
    }
    subscribe: block(id: "cG9zdDozNzcwNQ==", asPreview: $preview) {
      ...Block
    }
    support: block(id: "cG9zdDozNzY4Nw==", asPreview: $preview) {
      ...Block
    }
  }
  fragment Block on Block {
    block {
      ...BlockComponentData
    }
  }
  ${Block.fragments}
`;

export default SidebarDefault;
