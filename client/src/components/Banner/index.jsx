import React from 'react'
import styles from "./styles.module.css";
import faceSyncLogo from "../../assets/FaceSyncLogo.svg"


export default function Banner() {
  return (
    <div className={styles.bannerContainer}>
        <div className={styles.imageContainer}>
           <img className={styles.appLogo} src={faceSyncLogo} alt="Face Sync"/>
        </div>
        <h1 className={styles.appTitle}>Face Sync</h1>
    </div>
  )
}
