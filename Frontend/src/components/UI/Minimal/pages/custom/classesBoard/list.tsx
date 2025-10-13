import { Helmet } from 'react-helmet-async';
import { ListView } from '@/components/UI/Minimal/sections/custom/classesBoard/view';

// ----------------------------------------------------------------------

const metadata = { title: `탬버린뮤직 관리자 시스템` };

export default function Page() {

  return (
    <>
			<Helmet>
						<title> {metadata.title}</title>
			</Helmet>
			<ListView />
    </>
  );
}
