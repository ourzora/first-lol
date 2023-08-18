import styles from '../styles/form.module.css'

export function Input({ field, ...props }) {
    return (
        <input className={styles.input} {...field} {...props} />
    )
}
