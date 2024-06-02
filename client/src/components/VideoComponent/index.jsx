import React, {useEffect,useState, useRef} from 'react';

function VideoComponent({stream, width, height}) {
    const videoRef = useRef();
    const [isMuted, setIsMuted] =useState(true)

    useEffect(()=>{
        if(videoRef.current){
            videoRef.current.srcObject = stream;
        }
    }, [stream])

  return (
    <div className='video-box'>
        <video 
        autoPlay
        ref={videoRef}
        muted={isMuted}
        height={height}
        width={width}
        />
    </div>
  )
}

export default VideoComponent;