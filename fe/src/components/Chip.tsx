import styles from "./Chip.module.css";
import Icon from "./Icon";

type Props = {
  label: string;
  onClose: () => void;
}

function Chip({ label, onClose }: Props) {
  return (
    <div className={styles.chip}>
      <span className={styles.label}>{label}</span>
      <button type="button" className={styles.close} onClick={onClose} aria-label="삭제">
        <Icon name="close" />
      </button>
    </div>
  );
}

export default Chip;