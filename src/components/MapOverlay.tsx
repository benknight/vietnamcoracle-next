import cx from 'classnames';
import Image from 'next/image';
import { useState } from 'react';
import { CursorClickIcon } from '@heroicons/react/outline';
import useAPI from '../lib/useAPI';
import Block, { BlockContent, BlockTitle } from './Block';

export default function MapOverlay({
  className = '',
  iframeClassName = 'w-full',
  ...iframeProps
}) {
  const { data: blocks } = useAPI('/api/blocks/');
  const [mapInteractive, setMapInteractive] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  return (
    <>
      <div className={cx('relative', className)}>
        <iframe
          className={iframeClassName}
          loading="lazy"
          {...iframeProps}></iframe>
        <div
          className={cx(
            'group absolute inset-0 transition-all duration-300 flex items-center justify-center backdrop-blur-0',
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
                    src={blocks.about.block.image.sourceUrl}
                    width="100"
                  />
                </div>
                <BlockTitle>{blocks.support.block.title}</BlockTitle>
                <BlockContent>{blocks.support.block.description}</BlockContent>
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
              <CursorClickIcon className="inline align-bottom w-6 h-6 md:w-7 md:h-7" />{' '}
              Click to use the map
            </button>
          )}
        </div>
      </div>
    </>
  );
}
