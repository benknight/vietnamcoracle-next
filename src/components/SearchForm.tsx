'use client';
import cx from 'classnames';
import _debounce from 'lodash/debounce';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { sendGAEvent } from '@next/third-parties/google';

export default function SearchForm({ className = '', ...inputProps }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [value, setValue] = useState('');
  const query = searchParams?.get('query');

  useEffect(() => {
    if (query) {
      setValue(query);
    }
  }, [query]);

  return (
    <form
      className={cx('relative flex-auto', className)}
      onSubmit={event => {
        event.preventDefault();
        inputRef.current?.blur();
        sendGAEvent({
          action: 'search',
          params: {
            query: value,
          },
        });
        router.push(`/search/?query=${value}`, { scroll: true });
      }}
      role="search">
      <div className="absolute top-0 left-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
        <MagnifyingGlassIcon className="w-[18px] h-[18px]" />
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
