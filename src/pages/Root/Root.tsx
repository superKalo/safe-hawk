import { useMemo } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HIDE_COMPONENTS } from '@/common/constants';

const Root = () => {
	const location = useLocation();

	// for later use if needed
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const showComponenents = useMemo(() => {
		return !HIDE_COMPONENTS.includes(location.pathname);
	}, [location.pathname]);

	return (
		<>
			<Toaster position={'top-center'} reverseOrder={false} />
			<ScrollRestoration />
			<Outlet />
		</>
	);
};

export default Root;
