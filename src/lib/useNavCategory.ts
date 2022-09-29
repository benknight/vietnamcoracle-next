import { createContext, useContext } from 'react';

export const NavCategory = createContext(null);

export default function useNavCategory() {
  return useContext(NavCategory);
}
