import cx from 'classnames';
import _debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { SearchIcon } from '@heroicons/react/solid';
import { gaEvent } from '../lib/GoogleAnalytics';

export default function SearchInput({ className = '', ...inputProps }) {
  const inputRef = useRef<HTMLInputElement>();
  const router = useRouter();
  const [value, setValue] = useState('');

  useEffect(() => {
    if (router.query?.query) {
      setValue(router.query.query.toString());
    }
  }, [router.query.query]);

  return (
    <form
      className={cx('relative flex-auto', className)}
      onSubmit={event => {
        event.preventDefault();
        inputRef.current?.blur();
        gaEvent({
          action: 'search',
          params: {
            query: value,
          },
        });
        router.push({
          pathname: '/search/',
          query: { query: value },
        });
      }}>
      <div className="absolute top-0 left-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
        <SearchIcon className="w-[18px] h-[18px]" />
      </div>
      <input
        {...inputProps}
        className="form-field w-full h-9 pl-9 pr-3 rounded-full placeholder:text-black/20 placeholder:dark:text-gray-600"
        onChange={event => {
          setValue(event.target.value);
          inputProps.onChange?.(event);
        }}
        placeholder="Search"
        ref={inputRef}
        type="search"
        value={value}
      />
    </form>
  );
}
