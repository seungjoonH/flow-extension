import styles from "./Home.module.css";
import Extensions from "@/components/Extensions";

function HomePage() {
  return (
    <div className={styles.home}>
      <Extensions />
    </div>
  );
}

export default HomePage;