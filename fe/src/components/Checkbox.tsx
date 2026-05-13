import styles from "./Checkbox.module.css";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Checkbox({ label, checked, onChange }: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked);

  return (
    <label className={styles.checkbox}>
      <input type="checkbox" checked={checked} onChange={handleChange} />
      <span className={styles.label}>{label}</span>
    </label>
  );
}

export default Checkbox;