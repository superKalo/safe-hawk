import { useMemo } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { HIDE_COMPONENTS } from '@/common/constants'
import { Navbar, Footer } from '@/components'
import styles from './Root.module.scss'

const Root = () => {
    const location = useLocation()

    // for later use if needed
    const showComponenents = useMemo(() => {
        return !HIDE_COMPONENTS.includes(location.pathname)
    }, [location.pathname])

    return (
        <div className={styles.layout}>
            <Navbar />
            <ScrollRestoration />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Root
