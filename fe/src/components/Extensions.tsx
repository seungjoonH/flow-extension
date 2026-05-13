import styles from "./Extensions.module.css";
import Checkbox from "./Checkbox";
import Chip from "./Chip";
import Icon from "./Icon";
import useExtension from "@/hooks/useExtension";
import { CUSTOM_MAX } from "@/rules";
import { useEffect, useState } from "react";


type Extension = {
  name: string;
  checked: boolean;
};

type Extensions = {
  fixed: Extension[];
  custom: Extension[];
};


function Extensions() {
  const { getExtensions, createCustomExt, updateFixedExt, deleteCustomExt } = useExtension();

  const [extensions, setExtensions] = useState<Extensions>({ fixed: [], custom: [] });
  const [newExtension, setNewExtension] = useState("");


  /* API */
  
  const fetchExtensions = async () => {
    const data = await getExtensions();
    setExtensions(data);
  }


  /* Handlers */

  const handleCheckFixedExt = async (name: string, checked: boolean) => {
    await updateFixedExt(name, checked); await fetchExtensions();
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void setNewExtension(e.target.value);
  };

  const handleAddCustomExt = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createCustomExt(newExtension);
    setNewExtension("");
    await fetchExtensions();
  }

  const handleRemoveCustomExt = async(name: string) => {
    await deleteCustomExt(name);
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
            <input type="text" placeholder="확장자 입력" value={newExtension} onChange={handleInputChange} />
            <button type="submit" className={cls("button", newExtension || "disabled")}>
              <Icon name="add" />
              <span>추가</span>
            </button>
          </form>
          <div className={styles.chipWrapper}>
            <label className={styles.count}>{extensions.custom.length}/{CUSTOM_MAX}</label>
            <div className={styles.chips}>
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