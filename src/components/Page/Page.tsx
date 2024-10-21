import classNames from 'classnames'
import { motion } from 'framer-motion'
import styles from './Page.module.scss'

type Props = {
    children: React.ReactNode
    className?: string
}

const Page = ({ children, className }: Props) => {
    return (
        <motion.div className={classNames(styles.Page, className)} layout>
            {children}
        </motion.div>
    )
}

export default Page
