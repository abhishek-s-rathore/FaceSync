import React,{useState, useEffect, useReducer} from 'react';
import { useParams } from 'react-router-dom';
import { IoSend } from "react-icons/io5";
import { useSocket } from "../../context/SocketProvider";
import { chatReducer } from '../../store/chatReducer';
import { addHistory, addMessage } from '../../store/chatActions';
import useChatScroll from '../../hooks/useChatScroll';
import styles from "./styles.module.css";

function Chat({setIsChatWindowOpen}) {
   const [message, setMessage] = useState('');
   const [chat, dispatch] = useReducer(chatReducer, {messages:[]});
   const {socket, me} = useSocket();
   const param = useParams();
   const roomId = param?.roomId;
   const ref = useChatScroll(chat);

   const handleInput = (event)=>{
    const value = event.target.value;
    setMessage(value);
   }

   const handleSendMessage = (event)=>{
       console.log(message, 1);
       const messageData = {
        message: message,
        timeStamp: new Date().getTime(),
        author: me?.id
       }
       dispatch(addMessage(messageData))
       socket.emit('send-message',roomId, messageData )
       setMessage("");
   }

   const handleKeyPress = (event) => {
     if (event.keyCode === 13 && !event.shiftKey && (message.trim()?.length > 0)) {
        console.log(message, 2);
        const messageData = {
            message: message,
            timeStamp: Date.now(),
            author: me?.id
           }
           dispatch(addMessage(messageData))
           socket.emit('send-message',roomId, messageData )
           setMessage("");
     }
   }
   
   const handleAddMessage = (message)=>{
         dispatch(addMessage(message))
   }

   const handleGetMessage = (messages)=>{
         dispatch(addHistory(messages || []))
   }
   
   const handleChatWindowClose = ()=>{
    setIsChatWindowOpen(false);
   }
  
   useEffect(()=>{
    socket.on("add-message", handleAddMessage);
    socket.on("get-messages", handleGetMessage);
    return ()=>{
        socket.off("add-message");
        socket.off("get-messages");
    }
   }, [socket, me, handleAddMessage, handleGetMessage]);


  return (
    <div className={styles.container}>
     <header >
        <h1>In-Call Messages</h1>
        <span onClick={handleChatWindowClose}>X</span>
     </header>
     <main ref={ref}>
        {
        chat?.messages?.map((messageData)=>{
            return  <div key={messageData.message} className={ messageData.author === me?.id ? styles.myMessage :styles.peerMessage}>
                       <div>
                         <p>
                           <cite>You</cite>
                           <time dateTime={messageData.timeStamp}>{new Date(messageData.timeStamp).getHours() +":" +new Date(messageData.timeStamp).getMinutes()}</time>
                         </p>
                         <p>{ messageData.message}</p>
                       </div>
                    </div>
        })
        }
     </main>
     <footer>
        <input 
        onKeyUp={handleKeyPress}
        placeholder='Enter your Message'
        value={message}
        onChange={handleInput}
        />
        <span onClick={handleSendMessage}>
        <IoSend />
        </span>
     </footer>
    </div>
  )
}

export default Chat;