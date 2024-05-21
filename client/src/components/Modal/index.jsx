import React, {useRef, useState} from 'react';
import styles from "./styles.module.css";
import { IoCopyOutline } from "react-icons/io5";

export default function Modal({meetingId, setIsModalOpen}) {
   const [isCopied, setIsCopied] = useState(false)
    const idRef = useRef()
 
const closeModal = ()=>{
       setIsModalOpen(false);
}

const copyId = ()=>{
   const copiedId =idRef.current.innerText
         navigator.clipboard.writeText(copiedId);
         setIsCopied(true);
         setTimeout(()=>{
            setIsCopied(false)
         }, 2000)
}

  return (
    <div className={styles.modalContainer}>
         <p>Share this meeting id with other you want to join meeting.</p>
         
         <div className={styles.idContainer}>
            <span className={styles.idSpan} ref={idRef}>
               {meetingId}
            </span>

            <button onClick={copyId}>
             <IoCopyOutline  style={{color:"#000"}}/>
            </button>

            <span className={styles.closeButton} onClick={closeModal}>X</span>
         </div>

         <p style={{display: isCopied ? "inline-block": "none"}} className={styles.copied}>Copied!</p>
    </div>
  )
}
