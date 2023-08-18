import styles from '../styles/form.module.css'

export function Input({ placeholder }) {
    return (
        <input className={styles.input} placeholder={placeholder} />
    )
}
