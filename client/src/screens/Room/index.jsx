import React, { useEffect, useCallback, useState, useRef, useReducer } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import peer from "../../service/peer";
import ControlPannel from "../../components/ControlPanel";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import styles from "./styles.module.css";
import { useSocket } from "../../context/SocketProvider";
import { peerReducer } from "../../store/peerReducer";
import { addPeer, removePeer } from "../../store/peerActions";
import VideoComponent from "../../components/VideoComponent";
import { MdFullscreenExit } from "react-icons/md";
import { MdOutlineFullscreen } from "react-icons/md";

import Chat from "../../components/Chat";

const RoomPage = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [peerInfo, setPeerInfo]= useState({});
  const [myStream, setMyStream] = useState();
  const [isChatWindowOpen, setIsChatWindowOpen] = useState(false);
  const [screenStream, setScreenStream] = useState();
  const [screenStreamId, setScreenStreamId] = useState(null);
  const [remoteStream, setRemoteStream] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoStopped,setIsVideoStopped] = useState(true);
  const [isHighlightScreenRemote, setIsHighlightScreenRemote] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [peers, dispatch] = useReducer(peerReducer, {});

  const {socket, me} = useSocket();
  const param = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef= useRef();
  const screenRef= useRef();
  const {state} = location;
  const roomId = param?.roomId;
  const peerId = me?._id;

  // console.log(location.state, roomId,'state')

  const joinRoom = useCallback((roomId, peerId, state)=>{
      if(state === null){
        console.log(roomId)
        navigate('/', {state:{roomId}})
      }
    if(peerId && state !== null){
        socket.emit("join-room", {name: state.name, email: state.email, roomId, peerId})
    }
  }, [roomId, peerId, state]);
  
  const putMyStream = useCallback(async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({
         audio: true,
         video: true,
    });
    setMyStream(stream)
    if(videoRef.current){
      videoRef.current.srcObject = stream;
    }
    
});

// const putScreenStream = useCallback(async()=>{
//   const stream = await navigator.mediaDevices.getDisplayMedia({
//        video: true,
//        audio: {
//         mandatory: {
//             chromeMediaSource: 'desktop',
//         },
//         optional: []
//       }
//   });
//   if(screenRef.current){
//     screenRef.current.srcObject = stream;
//   }
//});

const switchStream = (stream)=>{
      setMyStream(stream);
      if(videoRef.current){
        videoRef.current.srcObject = stream;
      }

      Object.values(me?.connections).forEach((connection)=>{
        const  videoTrack = stream.getTracks().find(track=> track.kind === 'video');
         connection[0].peerConnection?.getSenders()[1]
         .replaceTrack(videoTrack)
         .catch(error=> console.error(error))
      })
}

const handleScreenShare = async()=>{

  if(screenStreamId){
    const stream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
    switchStream(stream)
    setScreenStreamId(null)

  }else{
    const stream = await navigator.mediaDevices.getDisplayMedia({});
    switchStream(stream)
    setScreenStreamId(me?.id || "")

  }




 
  // setScreenStreamId(me?.id || "")
}

const handleGetPeers = useCallback(({roomId, peers})=>{
  // console.log(roomId, peers, 'hey gp')
})

const handlePeerLeft = useCallback(({roomId, peerId})=>{
  dispatch(removePeer(peerId))
})

const  handlePeerJoined = useCallback(({ peerId, name , email})=>{
     const call = me.call(peerId, myStream);
          call?.on("stream", (peerStream)=>{
            dispatch(addPeer(peerId, peerStream));
          })
})

const  handleCall = useCallback((call)=>{
       call.answer(myStream);
       call.on("stream", (peerStream)=>{
        dispatch(addPeer(call.peer, peerStream));
      })
})

const handleMute = ()=>{
  const audioTracks = myStream.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks[0].enabled = !isMuted;
      setIsMuted(!isMuted);
    }
}

const toggleVideo = () => {
  const videoTracks = myStream.getVideoTracks();
  if (videoTracks.length > 0) {
    videoTracks[0].enabled = !isVideoStopped;
    setIsVideoStopped(!isVideoStopped);
  }
};

  useEffect(()=>{
      joinRoom(roomId, peerId, state);
  }, [roomId, peerId, state]);

   useEffect(()=>{
    putMyStream();
   }, [videoRef.current]);

  //  useEffect(()=>{
  //   putScreenStream();
  //  }, [screenRef.current]);


  //  useEffect(()=>{


  //  }, [me, myStream])




   useEffect(()=>{
     socket.on("get-peers", handleGetPeers)
     socket.on("peer-left",  handlePeerLeft)
     socket.on("peer-joined", handlePeerJoined)
     socket.on("user-started-sharing", (peerId)=>{setScreenStreamId(peerId)})
     socket.on("user-stopped-sharing", ()=>{setScreenStreamId(null)})
     me?.on("call", handleCall)
    return ()=>{
      socket.off("get-peers")
      socket.off("peer-left")
      socket.off("peer-joined")
      socket.off("user-started-sharing")
      socket.off("user-stopped-sharing")
      me?.off("call")

    }
   }, [socket, me,handleGetPeers, handlePeerLeft])


   useEffect(()=>{
    if(screenStreamId){
      socket.emit('start-sharing', {peerId : screenStreamId, roomId})
    }else{
      socket.emit('stop-sharing', { roomId })
    }
   }, [screenStreamId, roomId])

  return (
    <div className="room-window">
      <div
        style={{flex: isChatWindowOpen ? "0 1 74%" : "0 1 100%"}}
        className={"stream-window"} >
        {
          <div className={styles.myStreamContainer}>
            <cite>{'You'}</cite>
            <video
              ref={videoRef}
              autoPlay
              muted={true}
              height="100%"
              width="100%"/>
          </div> 
        }
        {
          screenStreamId 
          ? <ScreenSharingLayout peers={peers} screenStreamId={screenStreamId}/> 
          : <VideoGridLayout  peers={peers}/>
        }
      </div>

      <div className={isChatWindowOpen ? "chat-window" : "chat-window display-chat-none" }>
        <Chat setIsChatWindowOpen={setIsChatWindowOpen} />
      </div>
     {
      <ControlPannel  
        handleScreenShare={handleScreenShare} 
        isChatWindowOpen={isChatWindowOpen} 
        setIsChatWindowOpen={setIsChatWindowOpen}
        isMuted={isMuted}
        handleMute={handleMute}
        isVideoStopped={isVideoStopped}
        toggleVideo={toggleVideo}/>
     }
     { 
       isModalOpen 
       ? <Modal meetingId={roomId} setIsModalOpen={setIsModalOpen}/>
       : null
     }
  </div>
  );
};

export default RoomPage;


const ScreenSharingLayout = ({peers, screenStreamId})=>{

  console.log(peers, screenStreamId, 'hello')
      const [isFullScreen, setIsFullScreen] = useState(false);
      const [screenStream, setScreenStream] = useState(null);
      const [otherStream, setOtherStream] = useState(null);


      useEffect(()=>{
        let newPeersObject = {
          ...peers
        }
        delete newPeersObject[screenStreamId];
        setScreenStream(
           {
            
           [screenStreamId]:  peers[screenStreamId]

          }
        )
        setOtherStream(newPeersObject);

      }, [])

      const handleScreenResize = ()=>{
           setIsFullScreen(prevState=> !prevState);
      }

      // Object.keys(peers).map((key)=>{
      //   if(key === streamScreenId){
      //        setScreenStream(peers[key])
      //   }
      // })
      // let newPeersObject = {
      //   ...peers
      // }
      // delete newPeersObject[screenStreamId]

  return<>
      <div className="screen-sharing-container">
        <div className={isFullScreen ? "peer-screen enlarge-screen-sharing-video" : "peer-screen" }>
      {
        console.log(screenStream && screenStream[screenStreamId], 'heyyy')
      }
      {
      screenStream && <VideoComponent stream={screenStream[screenStreamId]} width={"100%"} height={"100%"} />
      } 
      <span 
      className="screen-resize-button"
         onClick={handleScreenResize}
      > {isFullScreen ? <MdFullscreenExit/> : <MdOutlineFullscreen/>}</span>
        </div>
        <div className="peer-videos">
        { 
otherStream &&
Object.values(otherStream).map((stream)=>{
return <VideoComponent  stream={stream?.stream} width={"200px"} height={"150px"} />
})
}
        </div>

      </div>
  </>
}

const VideoGridLayout = ({peers})=>{

 return(<div
  className={`participants-${Object?.values(peers)?.length}`}
  id={"video-grid"}>
  { 
    Object.values(peers).map((stream)=>{
       return <VideoComponent  stream={stream?.stream} />
     })
  }
 </div>)

}