import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./styles.module.css";
import { IoVolumeMuteSharp,IoVolumeHighSharp,IoVolumeLowSharp,IoVolumeMediumSharp ,IoVideocamSharp,IoVideocamOffSharp } from "react-icons/io5";
import { MdCallEnd } from "react-icons/md";
import { Tooltip } from 'react-tooltip'


export default function ControlPannel() {
    const [isVolumeOn, setIsVolumeOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const navigate = useNavigate();

    const handleVolume = (event)=>{
        setIsVolumeOn(previousVolume=>!previousVolume)
    }

    const handleVideo = (event)=>{
       setIsVideoOn(previousVideo=>!previousVideo)
    }  

    const handleCallEnd = (event)=>{
         navigate("/")
    }
   

  return (
    <div className={styles.controlPannel}>
      
      <button 
       className={styles.controls} 
       onClick={handleVolume}
       data-tooltip-id="info-tip" 
       data-tooltip-content={isVolumeOn ? "Mute" : "Unmute"}
       >
       {
         isVolumeOn ? <IoVolumeMuteSharp style={{color:"#fff"}} /> : <IoVolumeHighSharp style={{color:"#fff"}} />
       }
      </button>

      <button 
       className={styles.controls} 
       onClick={handleVideo} 
       data-tooltip-id="info-tip" 
       data-tooltip-content={isVideoOn ? "Pause Video" : "Stream Video"}
      >
       {
         isVideoOn ? <IoVideocamOffSharp style={{color:"#fff"}} /> : <IoVideocamSharp style={{color:"#fff"}} />
       }
      </button>

      <button 
       className={styles.controls} 
       onClick={handleCallEnd}
       data-tooltip-id="info-tip" 
       data-tooltip-content={"End Call"}
       >
        <MdCallEnd style={{color:"#ff0000"}}/>
      </button>

      <Tooltip id="info-tip"/>

    </div>
  )
}
