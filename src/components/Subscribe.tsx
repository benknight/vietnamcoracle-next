import _keyBy from 'lodash/keyBy';
import _mapValues from 'lodash/mapValues';
import Image from 'next/image';
import { useState } from 'react';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';
import useWaitCursor from '../lib/useWaitCursor';

interface Props {
  data: BlockType;
}

export default function Subscribe({ data: block }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
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
        let message = '';
        if (data.success) {
          message =
            messages['subscribe_success'] ||
            'Thanks for subscribing to Vietnam Coracle.';
          setEmail('');
        } else {
          message =
            messages['subscribe_error'] ||
            'Something went wrong. Please try again later.';
          if (data.code === 'ERR_ALREADY_SUBSCRIBED') {
            message =
              messages['already_subscribed'] ||
              'There is already an existing subcription for the provided email addresss';
          }
        }
        window.alert(message);
        setLoading(false);
      });
  };

  return (
    <Block>
      <div className="flex justify-center mb-4">
        <a href={block.link.url}>
          <Image
            alt=""
            className="h-full rounded-full object-cover"
            height="96"
            layout="fixed"
            src={block.image.sourceUrl}
            width="96"
          />
        </a>
      </div>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent>
        <p>{block.description}</p>
        <form
          className="flex justify-center max-w-xs mt-4 mx-auto"
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
          <button className="btn" type="submit">
            Subscribe
          </button>
        </form>
      </BlockContent>
    </Block>
  );
}
