'use client';
import cx from 'classnames';
import Image from 'next/legacy/image';
import { useState } from 'react';
import { CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import Block, { BlockContent, BlockTitle } from './Block';

interface Props extends React.IframeHTMLAttributes<HTMLIFrameElement> {
  className?: string;
  iframeClassName?: string;
  blockImage: string;
  blockTitle: string;
  blockDescription: string;
}

export default function MapOverlay({
  blockImage,
  blockTitle,
  blockDescription,
  className = '',
  iframeClassName = 'w-full min-h-[400px]',
  ...iframeProps
}: Props) {
  const [mapInteractive, setMapInteractive] = useState(false);
  const [showSupport, setShowSupport] = useState(false);

  return (
    <>
      <div className={cx('relative', className)}>
        <iframe
          className={iframeClassName}
          loading="lazy"
          title="Map"
          {...iframeProps}></iframe>
        <div
          className={cx(
            'group absolute inset-0 transition-all duration-300 flex items-center justify-center backdrop-blur-0 dark:text-white',
            showSupport ? 'backdrop-blur-md' : '',
            mapInteractive ? 'hidden' : 'flex',
          )}
          onClick={() => setShowSupport(true)}>
          {showSupport ? (
            <div className="p-4">
              <Block className="py-8 lg:px-8 shadow-xl max-w-3xl mx-auto rounded-lg text-center bg-white/80 dark:bg-gray-900/90">
                <div className="mb-6 flex justify-center">
                  <Image
                    alt=""
                    className="h-full rounded-full object-cover"
                    height="100"
                    layout="fixed"
                    src={blockImage}
                    width="100"
                  />
                </div>
                <BlockTitle>{blockTitle}</BlockTitle>
                <BlockContent>{blockDescription}</BlockContent>
                <div className="flex justify-center gap-2">
                  <a
                    className="btn !text-white !bg-primary-500 !hover:bg-primary-600"
                    href="https://donorbox.org/donate-to-vietnam-coracle"
                    onClick={() => setMapInteractive(true)}
                    target="_blank">
                    Donate
                  </a>
                  <button
                    className="btn"
                    onClick={() => setMapInteractive(true)}
                    type="button">
                    No Thanks
                  </button>
                </div>
              </Block>
            </div>
          ) : (
            <button className="py-4 px-8 dark:text-white rounded-full bg-white/90 hover:pointer:bg-white dark:bg-black/60 dark:hover:pointer:bg-black/75 shadow-lg transition-colors duration-150 text-blue-500 pointer:opacity-0 group-hover:pointer:opacity-100 text-base md:text-xl font-display font-medium">
              <CursorArrowRaysIcon className="inline align-bottom w-6 h-6 md:w-7 md:h-7" />{' '}
              Click to use the map
            </button>
          )}
        </div>
      </div>
    </>
  );
}
