import styles from "./Extensions.module.css";
import Checkbox from "./Checkbox";
import Chip from "./Chip";
import Icon from "./Icon";
import useExtension from "@/hooks/useExtension";
import { CUSTOM_MAX } from "@/rules";
import { useEffect, useRef, useState } from "react";
import useValidator from "@/hooks/useValidator";


type Extension = {
  name: string;
  checked: boolean;
};

type Extensions = {
  fixed: Extension[];
  custom: Extension[];
};


function Extensions() {
  const { getExtensions, createCustomExt, updateFixedExt, deleteCustomExt, deleteAllCustomExts } = useExtension();
  const { validateExtension } = useValidator();

  const [extensions, setExtensions] = useState<Extensions>({ fixed: [], custom: [] });
  const [newExtension, setNewExtension] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const disabled = !newExtension || error;


  /* API */
  
  const fetchExtensions = async () => {
    const { data, error } = await getExtensions();
    setExtensions(data);
    setError(error?.message);
  }

  /* Refs */

  const chipsRef = useRef<HTMLDivElement>(null);


  /* Handlers */

  const handleCheckFixedExt = async (name: string, checked: boolean) => {
    const { error } = await updateFixedExt(name, checked);
    setError(error?.message);
    await fetchExtensions();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExtension(e.target.value);
    setError(validateExtension(e.target.value));
  };

  const handleAddCustomExt = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (disabled) return;

    const { data, error } = await createCustomExt(newExtension);
    if (error) { setError(error.message); return; } 

    setNewExtension("");
    await fetchExtensions();

    // 커스텀 추가되었을 때만
    if (data.checked) return;
    chipsRef.current?.scrollTo({ top: chipsRef.current.scrollHeight, behavior: "smooth" });
  }

  const handleRemoveCustomExt = async(name: string) => {
    const { error } = await deleteCustomExt(name);
    setError(error?.message);
    await fetchExtensions();
  }

  const handleClearCustomExt = async () => {
    const { error } = await deleteAllCustomExts();
    setError(error?.message);
    await fetchExtensions();
  }

  /* Effects */

  useEffect(() => { fetchExtensions() }, []); 

  const cls = (...c: unknown[]) => c.filter(Boolean).join(" ");

  return (
    <section className={styles.extensions}>
      <div className={styles.row}>
        <div className={styles.header}>고정 확장자</div>
        <div className={styles.fixed}>
          {extensions.fixed.map((ext) => (
            <Checkbox 
              key={ext.name} 
              label={ext.name} 
              checked={ext.checked} 
              onChange={(checked) => handleCheckFixedExt(ext.name, checked)} 
            />
          ))}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.header}>커스텀 확장자</div>
        <div className={styles.custom}>
          <form className={styles.field} onSubmit={handleAddCustomExt}>
            <div className={styles.inputWrapper}>
              <input type="text" placeholder="확장자 입력" value={newExtension} onChange={handleInputChange} />
              {error && <div className="error">{error}</div>}
            </div>
            <button type="submit" className={cls("button", disabled && "disabled")}>
              <Icon name="add" />
              <span>추가</span>
            </button>
          </form>
          <div className={styles.chipWrapper}>
            <div className={styles.chipHeader}>
              <label className={styles.count}>{extensions.custom.length}/{CUSTOM_MAX}</label>
              <button type="button" className={styles.clear} onClick={handleClearCustomExt}>모두 삭제</button>
            </div>
            <div className={styles.chips} ref={chipsRef}>
              {extensions.custom.map((ext) => (
                <Chip 
                  key={ext.name}
                  label={ext.name}
                  onClose={() => handleRemoveCustomExt(ext.name)} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Extensions;