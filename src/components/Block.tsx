import cx from 'classnames';

export const BlockTitle = props => (
  <h3 className="text-base font-bold xs:text-xl lg:text-2xl xl:text-xl mb-3">
    {props.children}
  </h3>
);

export type BlockType = {
  description: string;
  title: string;
  image: {
    sourceUrl: string;
  };
  link: {
    title: string;
    url: string;
  };
  messages: [
    {
      key: string;
      value: string;
    },
  ];
};

export const BlockContent = ({ className = '', children }) => (
  <div
    className={cx(
      className,
      'mx-auto mb-8 px-4',
      'max-w-sm lg:max-w-md',
      'text-sm sm:text-base xl:text-[15px] font-serif',
      'text-gray-600 dark:text-gray-400',
    )}>
    {children}
  </div>
);

const Block = ({ className = '', children }) => (
  <aside className={cx(className, 'c-block text-center font-display')}>
    {children}
  </aside>
);

export default Block;
