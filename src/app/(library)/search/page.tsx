import type { Metadata } from 'next';
import { SearchPage } from '../../components/SearchPage';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search your private Muzalo music library.',
};

export default function SearchRoute() {
  return <SearchPage />;
}
