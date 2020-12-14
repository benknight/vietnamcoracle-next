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
    about: component(id: "cG9zdDozNjExOA==") {
      ...Block
    }
    subscribe: component(id: "cG9zdDozNzcwNQ==") {
      ...Block
    }
    support: component(id: "cG9zdDozNzY4Nw==") {
      ...Block
    }
  }
  fragment Block on Component {
    block {
      ...BlockComponentData
    }
  }
  ${Block.fragments}
`;

export default SidebarDefault;
