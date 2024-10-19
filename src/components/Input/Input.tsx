import classNames from 'classnames'
import styles from './Input.module.scss'
import { InputHTMLAttributes, useCallback, useRef } from 'react'
import { ArrowIcon } from '@/assets/icons'
import { motion } from 'framer-motion'

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'onSubmit'> & {
    name: string
    label?: string
    small?: boolean
    onSubmit?: (value: string) => void
}

const Input = ({ name, className, label, small, onSubmit, ...props }: Props) => {
    const inputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = useCallback(() => {
        if (onSubmit && inputRef.current) {
            onSubmit(inputRef.current.value)
        }
    }, [onSubmit])

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSubmit()
        }
    }

    return (
        <motion.div
            className={classNames(styles.input, className, { [styles.small]: small })}
            layout
        >
            {label ? <label htmlFor={name}>{label}</label> : null}
            <input ref={inputRef} id={name} name={name} onKeyDown={handleKeyDown} {...props} />
            <ArrowIcon className={styles.icon} onClick={handleSubmit} />
        </motion.div>
    )
}

export default Input
