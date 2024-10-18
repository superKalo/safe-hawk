import { createBrowserRouter } from 'react-router-dom'
import { Root, Home, Dashboard } from '@/pages'
import ErrorPage from '@/ErrorPage'
import { isExtension } from './helpers/browserApi'

const router = createBrowserRouter([
    {
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: isExtension ? '/popup.html' : '/',
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
