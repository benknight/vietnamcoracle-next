import { gql } from 'graphql-request';
import About from './About';
import Block from './Block';
import Subscribe from './Subscribe';
import Support from './Support';
import SlidingSticky from './SlidingSticky';

const SidebarDefault = ({ data }) => (
  <SlidingSticky>
    <section className="mb-20">
      <About data={data.about.block} />
    </section>
    <section className="mb-20">
      <Support data={data.support.block} />
    </section>
    <section>
      <Subscribe data={data.subscribe.block} />
    </section>
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
