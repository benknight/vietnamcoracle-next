import cx from 'classnames';
import _keyBy from 'lodash/keyBy';
import _mapValues from 'lodash/mapValues';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import internalizeUrl from '../lib/internalizeUrl';
import useWaitCursor from '../lib/useWaitCursor';
import Block, { BlockContent, BlockTitle, BlockType } from './Block';
import ElsewhereLinks from './ElsewhereLinks';

interface Props {
  data: BlockType;
}

interface HookOptions {
  messages?: {
    alreadySubscribed?: string;
    error?: string;
    success?: string;
  };
  successRedirectUrl?: string;
}

export function useSubscribeForm(opts?: HookOptions) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useWaitCursor(loading);
  const onSubmit = useCallback(email => {
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
          if (opts?.successRedirectUrl) {
            router.push(internalizeUrl(opts.successRedirectUrl));
          } else {
            message =
              opts?.messages?.success ||
              'Thank you for subscribing to Vietnam Coracle';
          }
        } else {
          message =
            opts?.messages?.error ||
            'Something went wrong. Please try again later.';
          if (data.code === 'ERR_ALREADY_SUBSCRIBED') {
            message =
              opts?.messages?.alreadySubscribed ||
              'There is already an existing subcription for the provided email addresss';
          }
        }
        if (message) {
          window.alert(message);
        }
        setLoading(false);
      });
  }, []);
  return { isLoading: loading, onSubmit };
}

export default function Subscribe({ data: block }: Props) {
  const [email, setEmail] = useState('');
  const messages = _mapValues(_keyBy(block.messages, 'key'), 'value');
  const { isLoading, onSubmit } = useSubscribeForm({
    messages: {
      alreadySubscribed: messages['already_subscribed'],
      error: messages['subscribe_error'],
      success: messages['subscibe_success'],
    },
    successRedirectUrl: block.link.url,
  });
  return (
    <Block>
      <BlockTitle>{block.title}</BlockTitle>
      <BlockContent>
        <p>{block.description}</p>
        <form
          className="flex justify-center max-w-xs mt-4 mb-8 mx-auto"
          onSubmit={event => {
            event.preventDefault();
            onSubmit(email);
          }}>
          <input
            className="form-field flex-auto h-8 mr-2 p-2 text-sm rounded"
            placeholder="Email"
            onChange={event => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
          <button
            className={cx('btn', { 'opacity-50': isLoading })}
            disabled={isLoading}
            type="submit">
            Subscribe
          </button>
        </form>
        <ElsewhereLinks />
      </BlockContent>
    </Block>
  );
}
