import classNames from 'classnames'
import styles from './Input.module.scss'

type Props = {
    className?: string
    type?: string
    name: string
    label?: string
    small?: boolean
    readOnly?: boolean
    required?: boolean
    min?: number
    max?: number
    defaultValue?: string | number
    disabled?: boolean
    placeholder?: string
}

const Input = ({
    className,
    type,
    name,
    label,
    small,
    readOnly,
    min,
    max,
    required,
    defaultValue,
    disabled,
    placeholder,
    ...props
}: Props) => {
    return (
        <div className={classNames(styles.input, className, { [styles.small]: small })}>
            {label ? <label htmlFor={name}>{label}</label> : null}
            <input
                type={type ?? 'text'}
                id={name}
                name={name}
                {...props}
                readOnly={readOnly}
                min={min}
                max={max}
                required={required}
                defaultValue={defaultValue}
                disabled={disabled}
                placeholder={placeholder}
            />
        </div>
    )
}

export default Input
