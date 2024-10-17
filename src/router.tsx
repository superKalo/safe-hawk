import { createBrowserRouter } from 'react-router-dom'
import { Root, Home } from './pages'
import ErrorPage from './ErrorPage'

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
    }
])

export default router
