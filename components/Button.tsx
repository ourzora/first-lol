import styles from '../styles/form.module.css'

export function Button({ children }) {
    return (
        <button className={styles.button}>
            {children}
        </button>
    )
}
