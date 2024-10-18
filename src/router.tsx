import { createBrowserRouter } from 'react-router-dom'
import { Root, Home } from './pages'
import ErrorPage from './ErrorPage'
import Email from './pages/Email'

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />,
                errorElement: <ErrorPage />
            }
        ]
    },
    {
        path: '/email',
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/email',
                element: <Email />,
                errorElement: <ErrorPage />
            }
        ]
    }
])

export default router
