import classNames from 'classnames'
import styles from './Page.module.scss'

type Props = {
    children: React.ReactNode
    className?: string
}

const Page = ({ children, className }: Props) => {
    return <div className={classNames(styles.Page, className)}>{children}</div>
}

export default Page
