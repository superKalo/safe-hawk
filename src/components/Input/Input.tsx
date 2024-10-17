import classNames from 'classnames'
import styles from './Input.module.scss'
import { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
    name: string
    label?: string
    small?: boolean
}

const Input = ({
    name,
    className,
    label,
    small,
    ...props
}: Props) => {
    return (
        <div className={classNames(styles.input, className, { [styles.small]: small })}>
            {label ? <label htmlFor={name}>{label}</label> : null}
            <input
                id={name}
                name={name}
                {...props}
            />
        </div>
    )
}

export default Input
