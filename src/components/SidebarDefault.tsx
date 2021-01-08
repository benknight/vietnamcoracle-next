import { gql } from 'graphql-request';
import About from './About';
import Block from './Block';
import { LayoutSidebar } from './Layout';
import Subscribe from './Subscribe';
import Support from './Support';

const SidebarDefault = ({ data: { about, subscribe, support } }) => (
  <LayoutSidebar>
    <section className="mb-20">
      <About data={about.block} />
    </section>
    <section className="mb-20">
      <Support data={support.block} />
    </section>
    <section className="mb-12">
      <Subscribe data={subscribe.block} />
    </section>
  </LayoutSidebar>
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
