// Create a file named graphql.d.ts in your project
// graphql.d.ts

declare module '*.gql' {
  import { DocumentNode } from 'graphql';
  const content: DocumentNode;
  export default content;
}

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';
  const content: DocumentNode;
  export default content;
}
