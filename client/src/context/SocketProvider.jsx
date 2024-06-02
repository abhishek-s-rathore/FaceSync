import React, { createContext, useMemo, useContext, useState, useEffect } from "react";
import { io } from "socket.io-client";
import ShortUniqueId from 'short-unique-id';
import Peer from "peerjs";

const WSS = "http://localhost:8000";
const SocketContext = createContext(null);

export const useSocket = () => {
  const {socket, me} = useContext(SocketContext);
  return {socket, me};
};

export const SocketProvider = ({children}) => {
  const socket = useMemo(() => io(WSS), []);
  const [me, setMe] = useState(null);
  // const [myStream, setMyStream] = useState(null);

  useEffect(()=>{
    const uid = new ShortUniqueId({ length: 10 });
    const meId = uid.rnd();
    const peer = new Peer(meId);
    setMe(peer);

//   try {
//     navigator.mediaDevices.getUserMedia({
//       audio: true,
//       video: true,
//  }).then((stream)=>{

//      setMyStream(stream);
//  });

    
//   } catch (error) {
//      console.err(error)
//   }

  }, [])


  // useEffect(()=>{
  //   if(!me) return;
  //   if(!myStream) return;

  //   socket.on('user-joined', ()=>{

  //   })

  // }, [me, myStream])




  return (
    <SocketContext.Provider value={{socket, me}}>
      {children}
    </SocketContext.Provider>
  );
};
