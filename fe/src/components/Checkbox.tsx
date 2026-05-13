import styles from "./Checkbox.module.css";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Checkbox({ label, checked, onChange }: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.checked);

  return (
    <div className={styles.checkbox}>
      <input type="checkbox" checked={checked} onChange={handleChange} id={label} />
      <label className={styles.label} htmlFor={label}>{label}</label>
    </div>
  );
}

export default Checkbox;