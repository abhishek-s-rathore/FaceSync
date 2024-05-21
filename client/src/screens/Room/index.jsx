import React, { useEffect, useCallback, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactPlayer from "react-player";
import peer from "../../service/peer";
import ControlPannel from "../../components/ControlPanel";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import styles from "./styles.module.css"

import { useSocket } from "../../context/SocketProvider";

const RoomPage = () => {
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [peerInfo, setPeerInfo]= useState({}) 
  const [remoteStream, setRemoteStream] = useState();
  const [isHighlightScreenRemote, setIsHighlightScreenRemote] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const socket = useSocket();
  const location = useLocation();
  const id = location.pathname.split('/')[2];


   useEffect(()=>{
        setStream();
   }, [])

   const setStream = useCallback(async()=>{
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
     setMyStream(stream);
  })


  const handleView = useCallback(()=>{
          setIsHighlightScreenRemote(prevState=> !prevState)
        }, []);

  const handleUserJoined = useCallback(({ email, id, name }) => {
    console.log(`Email ${email, name} joined room`);
    setPeerInfo({
      name: name,
      email:email
    })
    setRemoteSocketId(id);
  }, []);

  const handleCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("Call Accepted!");
      sendStreams();
    },
    [sendStreams]
  );



  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedFinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedFinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleIncommingCall);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedFinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedFinal,
  ]);


  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      console.log("GOT TRACKS!!");
      setRemoteStream(remoteStream[0]);
    });
  }, []);


  useEffect(()=>{
      if( remoteSocketId){
      handleCallUser()
      }
  }, [remoteSocketId]);


  return (
    <div>
      
      {/* {remoteSocketId && <button onClick={handleCallUser}>CALL</button>} */}
      {/* {myStream && <button onClick={sendStreams}>Send Stream</button>} */}

    {
      myStream && 
         <div 
         className={!isHighlightScreenRemote ? styles.remoteStreamContainer : styles.myStreamContainer} 
         onClick={handleView}>
          <cite>{'You'}</cite>
          <ReactPlayer
            playing
            muted={true}
            height="100%"
            width="100%"
            url={myStream}
          />
        </div> 
    }


      <div
       className={ isHighlightScreenRemote ? styles.remoteStreamContainer : styles.myStreamContainer}
       onClick={handleView}>
    {
      remoteSocketId   
      ? 
      remoteStream ?
          <>
         <cite>{peerInfo?.name}</cite>
         <ReactPlayer
           playing
           muted={true}
           height="100%"
           width="100%"
           url={remoteStream}
         />
         </>
       : <Loader/>

    : <p>  Waiting others to join... </p>
    }

</div>
   {
    <ControlPannel/>
   }
   { 
   isModalOpen && <Modal  meetingId={id} setIsModalOpen={setIsModalOpen} />
   }
  </div>
  );
};

export default RoomPage;
