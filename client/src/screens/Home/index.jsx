import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";

import ShortUniqueId from 'short-unique-id';
import styles from "./styles.module.css"
import { useSocket } from "../../context/SocketProvider";
import Banner from "../../components/Banner";
import MeetingForm from "../../components/MeetingForm";

const  HomeScreen = () => {
  const [info, setInfo] = useState(null);
  const navigate = useNavigate();
  const socket = useSocket();

  const handleSubmitForm = useCallback(
    (name,email,meetingId ) => {
      let id ;
      if(!meetingId){
        const uid = new ShortUniqueId({ length: 10 });
        id = uid.rnd();
      }else{
        id = meetingId;
      }
      setInfo({
        name: name,
        email:email, 
        meetingId:id
      })

      socket.emit("room:join", { name ,email, meetingId:id });
    },
    [info, socket]
  );

  const handleJoinRoom = useCallback(
    (data) => {
      const {name, email, meetingId } = data;
      navigate(`/meeting/${meetingId}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleJoinRoom);
    return () => {
      socket.off("room:join", handleJoinRoom);
    };
  }, [socket, handleJoinRoom]);


  return (
    <div className={styles.container}>
      <Banner/>
      <MeetingForm handleJoinMeeting={handleSubmitForm}/>
    </div>
  );
};

export default HomeScreen;