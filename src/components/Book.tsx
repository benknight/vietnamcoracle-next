import _keyBy from 'lodash/keyBy';
import _mapValues from 'lodash/mapValues';
import Block, { BlockContent, BlockTitle } from './Block';

// interface Props {
//   data: BlockType;
// }

// export default function Book({ data: block }: Props) {
export default function Book() {
  return (
    <Block>
      <BlockTitle>Plan Your Trip</BlockTitle>
      <BlockContent>
        <p>
          Plan your trip and book all your hotels and transportation in Vietnam
          through this website. If you make a booking, I receive a small
          commission (at no extra cost to you).
        </p>
        Book: Hotels | Transportation
      </BlockContent>
    </Block>
  );
}
