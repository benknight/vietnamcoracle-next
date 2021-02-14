import { gql } from 'graphql-request';
import About from './About';
import Block from './Block';
import ElsewhereLinks from './ElsewhereLinks';
import Subscribe from './Subscribe';
import Support from './Support';
import SlidingSticky from './SlidingSticky';

const SidebarDefault = ({ data }) => (
  <SlidingSticky>
    <aside className="mb-20">
      <About data={data.about.block} />
    </aside>
    <aside className="mb-20">
      <Support data={data.support.block} />
    </aside>
    <aside>
      <Subscribe data={data.subscribe.block} />
    </aside>
    <div className="mt-4 mb-14">
      <ElsewhereLinks />
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
