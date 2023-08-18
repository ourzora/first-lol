import { useFormikContext } from 'formik';
import styles from '../styles/form.module.css'

export function Button({ children, disabled }) {
    // Grab values and submitForm from context
    const { submitForm, isSubmitting, touched } = useFormikContext();
    return (
        <button className={styles.button} type="submit" onClick={submitForm} disabled={disabled}>
            {children}
        </button>
    )
}
