import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSocket } from "../../context/SocketProvider";
import Banner from "../../components/Banner";
import MeetingForm from "../../components/MeetingForm";
import styles from "./styles.module.css"

const  HomeScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {state} = location;
  const {socket} = useSocket();

  const handleSubmit= async (name, email, roomId)=>{
   
    if(roomId === undefined){
      socket.emit("create-room", {name, email});
    }else{
      navigate(`/room/${roomId}`, {state: {name,email}});
    }
  }

  const enterRoom = useCallback(({name, email, roomId})=>{
      navigate(`/room/${roomId}`, {state : {name, email}});
    },[navigate]);

  useEffect(() => {
    socket.on("room-created", enterRoom);
    return () => {
      socket.off("room-created");
    };
  }, [socket, enterRoom]);

  // console.log(state)

  return (
    <div className={styles.container}>
      <Banner/>
      <MeetingForm handleSubmit={handleSubmit} roomId={state?.roomId}/>
    </div>
  );
};

export default HomeScreen;