import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
	const error = useRouteError();

	return (
		<div className={'error-container'}>
			<h1>{(error as { status: string }).status}</h1>
			<h2>{(error as { message: string }).message}</h2>
			<Link to={'/'}>Home</Link>
		</div>
	);
};

export default ErrorPage;
