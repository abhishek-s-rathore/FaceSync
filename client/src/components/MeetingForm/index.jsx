import React,{useEffect, useState} from 'react';
import styles from "./styles.module.css";

export default function MeetingForm({handleSubmit, roomId}) {
  const [tab, setTab] = useState('create-room');

  const handleTab = (type)=>{
     setTab(type);
  }

  useEffect(()=>{
    if(roomId){
      setTab('join-room')
    }
  }, [roomId]);

  return (
    <div className={styles.formContainer}>
      <div className={styles.tabContainer}>
        <button style={{backgroundColor:tab === "create-room" ? "rgba(255,255,255,.15)" : "transparent"}} onClick={()=>handleTab('create-room')}>Create Room</button>
        <button style={{backgroundColor:tab === "join-room" ? "rgba(255,255,255,.15)" : "transparent"}} onClick={()=>handleTab('join-room')}>Join Room</button>
      </div>
      {
        tab === 'create-room' && <CreateMeetingForm handleSubmit={handleSubmit}/>
      }
        {
        tab === 'join-room' &&  <JoinMeetingForm handleSubmit={handleSubmit} roomIdFromState={roomId}/>
      }
    </div>
  )
}

const CreateMeetingForm = ({handleSubmit})=>{
  const[name, setName] = useState('');
  const[email, setEmail] = useState('');

  const handleInput = (event)=>{
    const {name , value} = event.target;
    if(name === "name"){
     setName(value)
    }else if(name === "email"){
     setEmail(value)
    }
  }

  const handleSubmitForm = (event)=>{
    event.preventDefault();
    handleSubmit(name, email);
 }

  return(
    <form className={styles.form} onSubmit={handleSubmitForm}>
         <label htmlFor="name">Name</label>
         <input type="text" name="name" id="name" value={name} onChange={handleInput}  />
         <label htmlFor="email">Email</label>
         <input type="text" name="email" id="email" value={email} onChange={handleInput}  />
         <button type='submit'>
          Create Room
         </button>
    </form>
  )
}

const JoinMeetingForm = ({handleSubmit, roomIdFromState})=>{
  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const[roomId, setRoomId] = useState('');

  useEffect(()=>{
    if(roomIdFromState){
      setRoomId(roomIdFromState)
    }
  }, [roomIdFromState])

  const handleInput = (event)=>{
    const {name , value} = event.target;
    if(name === "name"){
     setName(value)
    }else if(name === "email"){
     setEmail(value)
    }else if(name === "roomId"){
     setRoomId(value)
    }
  }

  const handleSubmitForm = (event)=>{
     event.preventDefault()
     handleSubmit(name, email, roomId)
  }

  return(
    <form className={styles.form} onSubmit={handleSubmitForm}>
         <label htmlFor="name">Name</label>
         <input type="text" name="name" id="name" value={name} onChange={handleInput} />
         <label htmlFor="email">Email</label>
         <input type="text" name="email" id="email" value={email} onChange={handleInput}  />
         <label htmlFor="roomId">Room Id</label>
         <input type="text" name="roomId" id="roomId" value={roomId} onChange={handleInput}  />
         <button type='submit'>
          Join Room
         </button>
    </form>
  )
}