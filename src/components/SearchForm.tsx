import cx from 'classnames';
import _debounce from 'lodash/debounce';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SearchIcon } from '@heroicons/react/solid';

export default function SearchInput({ className = '', ...inputProps }) {
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
        router.push({
          pathname: '/search',
          query: { query: value },
        });
      }}>
      <div className="absolute top-0 left-0 bottom-0 w-10 flex items-center justify-center pointer-events-none">
        <SearchIcon className="w-5 h-5" />
      </div>
      <input
        {...inputProps}
        className="form-field w-full h-10 pl-9 pr-3 rounded-full"
        onChange={event => {
          setValue(event.target.value);
        }}
        placeholder="Search"
        type="search"
        value={value}
      />
    </form>
  );
}
