import React,{useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./styles.module.css";
import { IoVolumeMuteSharp,IoVolumeHighSharp,IoVideocamSharp,IoVideocamOffSharp } from "react-icons/io5";
import { MdOutlineScreenShare,MdOutlineStopScreenShare,  MdCallEnd } from "react-icons/md";
import { RiChat4Line,RiChatOffLine  } from "react-icons/ri";
import { Tooltip } from 'react-tooltip'


export default function ControlPannel({handleScreenShare, isChatWindowOpen, setIsChatWindowOpen, isMuted, handleMute, isVideoStopped, toggleVideo}) {
    const [isVolumeOn, setIsVolumeOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isScreenCasting, setIsScreenCasting] = useState(false);

    const navigate = useNavigate();

    const handleVolume = (event)=>{
        // setIsVolumeOn(previousVolume=>!previousVolume)
        handleMute();
    }

    const handleVideo = (event)=>{
      //  setIsVideoOn(previousVideo=>!previousVideo);
      toggleVideo();
    }  

    const handleScreenCast = (event)=>{
      setIsScreenCasting(previousState=>!previousState);
      handleScreenShare()
   }  

   const handleChatWindow = (event)=>{
    setIsChatWindowOpen(previousState=>!previousState);

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
       data-tooltip-content={isMuted ? "Mute" : "Unmute"}
       >
       {
         isMuted ? <IoVolumeMuteSharp style={{color:"#fff"}} /> : <IoVolumeHighSharp style={{color:"#fff"}} />
       }
      </button>

      <button 
       className={styles.controls} 
       onClick={handleVideo} 
       data-tooltip-id="info-tip" 
       data-tooltip-content={isVideoStopped ? "Pause Video" : "Stream Video"}
      >
       {
         isVideoStopped ? <IoVideocamOffSharp style={{color:"#fff"}} /> : <IoVideocamSharp style={{color:"#fff"}} />
       }
      </button>

      <button 
       className={styles.controls} 
       onClick={handleScreenCast} 
       data-tooltip-id="info-tip" 
       data-tooltip-content={isScreenCasting ? "Stop Screencast" : "Start Screencast"}
      >
       {
         isScreenCasting ? <MdOutlineStopScreenShare style={{color:"#fff"}} /> : <MdOutlineScreenShare style={{color:"#fff"}} />
       }
      </button>

      <button 
       className={styles.controls} 
       onClick={handleChatWindow} 
       data-tooltip-id="info-tip" 
       data-tooltip-content={isChatWindowOpen ? "Close Chat Window" : "Open Chat Window"}
      >
       {
         isChatWindowOpen ? <RiChatOffLine style={{color:"#fff"}} /> : <RiChat4Line style={{color:"#fff"}} />
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
