import React,{useState} from 'react';
import styles from "./styles.module.css";

export default function MeetingForm({handleJoinMeeting}) {
  const [tab, setTab] = useState('create-meeting');

  const handleTab = (type)=>{
     setTab(type);
  }

  return (
    <div className={styles.formContainer}>
      <div className={styles.tabContainer}>
        <button style={{backgroundColor:tab === "create-meeting" ? "rgba(255,255,255,.15)" : "transparent"}} onClick={()=>handleTab('create-meeting')}>Create Meeting</button>
        <button style={{backgroundColor:tab === "join-meeting" ? "rgba(255,255,255,.15)" : "transparent"}} onClick={()=>handleTab('join-meeting')}>Join Meeting</button>
      </div>
      {
        tab === 'create-meeting' && <CreateMeetingForm handleJoinMeeting={handleJoinMeeting}/>
      }
        {
        tab === 'join-meeting' &&  <JoinMeetingForm handleJoinMeeting={handleJoinMeeting}/>
      }
    </div>
  )
}

const CreateMeetingForm = ({handleJoinMeeting})=>{
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

  const handleSubmit = (event)=>{
    event.preventDefault();
    handleJoinMeeting(name, email)
 }

  return(
    <form className={styles.form} onSubmit={handleSubmit}>
         <label htmlFor="name">Name</label>
         <input type="text" name="name" id="name" value={name} onChange={handleInput}  />
         <label htmlFor="email">Email</label>
         <input type="text" name="email" id="email" value={email} onChange={handleInput}  />
         <button type='submit'>
          Create Meeting
         </button>
    </form>
  )
}

const JoinMeetingForm = ({handleJoinMeeting})=>{
  const[name, setName] = useState('');
  const[email, setEmail] = useState('');
  const[meetingId, setMeetingId] = useState('');

  const handleInput = (event)=>{
    const {name , value} = event.target;
    if(name === "name"){
     setName(value)
    }else if(name === "email"){
     setEmail(value)
    }else if(name === "meetingId"){
     setMeetingId(value)
    }
  }

  const handleSubmit = (event)=>{
     event.preventDefault()
     handleJoinMeeting(name, email, meetingId)
  }

  return(
    <form className={styles.form} onSubmit={handleSubmit}>
         <label htmlFor="name">Name</label>
         <input type="text" name="name" id="name" value={name} onChange={handleInput} />
         <label htmlFor="email">Email</label>
         <input type="text" name="email" id="email" value={email} onChange={handleInput}  />
         <label htmlFor="meetingId">Meeting Id</label>
         <input type="text" name="meetingId" id="meetingId" value={meetingId} onChange={handleInput}  />
         <button type='submit'>
          Join Meeting
         </button>
    </form>
  )
}