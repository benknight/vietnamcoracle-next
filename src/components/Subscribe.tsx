import cx from 'classnames';
import _keyBy from 'lodash/keyBy';
import _mapValues from 'lodash/mapValues';
import { useRouter } from 'next/router';
import { useState } from 'react';
import internalizeUrl from '../lib/internalizeUrl';
import useWaitCursor from '../lib/useWaitCursor';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';
import ElsewhereLinks from './ElsewhereLinks';

interface Props {
  data: BlockType;
}

export default function Subscribe({ data: block }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const messages = _mapValues(_keyBy(block.messages, 'key'), 'value');

  useWaitCursor(loading);

  const onSubmit = () => {
    setLoading(true);
    fetch('/api/subscribe', {
      method: 'post',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          router.push(internalizeUrl(block.link.url));
        } else {
          let message = '';
          message =
            messages['subscribe_error'] ||
            'Something went wrong. Please try again later.';
          if (data.code === 'ERR_ALREADY_SUBSCRIBED') {
            message =
              messages['already_subscribed'] ||
              'There is already an existing subcription for the provided email addresss';
          }
          window.alert(message);
        }
        setLoading(false);
      });
  };

  return (
    <Block>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent>
        <p>{block.description}</p>
        <form
          className="flex justify-center max-w-xs mt-4 mb-8 mx-auto"
          onSubmit={event => {
            event.preventDefault();
            onSubmit();
          }}>
          <input
            className="form-field flex-auto h-8 mr-2 p-2 text-sm rounded"
            onChange={event => setEmail(event.target.value)}
            type="email"
            value={email}
          />
          <button
            className={cx('btn', { 'opacity-50': loading })}
            disabled={loading}
            type="submit">
            Subscribe
          </button>
        </form>
        <ElsewhereLinks />
      </BlockContent>
    </Block>
  );
}
