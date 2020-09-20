import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/SearchRounded';

export default function Nav() {
  return (
    <nav className="h-16 px-4 flex items-center">
      <MenuIcon />
      <div className="flex-auto">
        <button className="px-4 inline-flex text-sm">
          Browse by category <ArrowDropDownIcon />
        </button>
      </div>
      <SearchIcon className="text-gray-700" />
    </nav>
  );
}
