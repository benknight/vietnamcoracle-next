import cx from 'classnames';
import { ReactNode } from 'react';

export interface BlockData {
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
  mid?: string;
}

export const BlockTitle = (props: { children: ReactNode }) => (
  <h3 className="text-base font-bold xs:text-xl lg:text-2xl xl:text-xl 2xl:text-[22px] mb-3">
    {props.children}
  </h3>
);

export const BlockContent = (props: {
  className?: string;
  children: ReactNode;
}) => (
  <div
    className={cx(
      props.className,
      'mx-auto mb-8 px-4',
      'max-w-sm lg:max-w-md',
      'text-sm sm:text-base xl:text-[15px] 2xl:text-base font-serif',
      'text-gray-600 dark:text-gray-400',
    )}>
    {props.children}
  </div>
);

const Block = (props: { className?: string; children: ReactNode }) => (
  <aside className={cx(props.className, 'c-block text-center font-display')}>
    {props.children}
  </aside>
);

export default Block;
