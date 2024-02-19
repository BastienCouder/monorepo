import { Loader } from 'lucide-react';
import styles from '@/styles/keyframes.module.css';

export default function Spinner() {
  return (
    <div className={`${styles.spinnerContainer}`}>
      <Loader className={`${styles.spinner}`} size={24} />
    </div>
  );
}
