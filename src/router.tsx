import { createBrowserRouter } from 'react-router-dom'
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
    }
])

export default router
