import { createBrowserRouter } from 'react-router-dom'
import Email from './pages/Email'
import { Root, Home, Dashboard } from '@/pages'
import ErrorPage from '@/ErrorPage'

const router = createBrowserRouter([
    {
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />,
                errorElement: <ErrorPage />
            },
            {
                path: '/dashboard',
                element: <Dashboard />,
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
