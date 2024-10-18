import { useMemo } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { HIDE_COMPONENTS } from '@/common/constants'
import { Navbar, Footer } from '@/components'

const Root = () => {
    const location = useLocation()

    // for later use if needed
    const showComponenents = useMemo(() => {
        return !HIDE_COMPONENTS.includes(location.pathname)
    }, [location.pathname])

    return (
        <>
            <Navbar />
            <ScrollRestoration />
            <Outlet />
            <Footer />
        </>
    )
}

export default Root
