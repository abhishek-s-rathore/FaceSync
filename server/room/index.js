const ShortUniqueId = require("short-unique-id")

const rooms = {};
const chats = {};

const roomHandler = (socket)=>{

    const createRoom = ({name, email})=>{
        const uid = new ShortUniqueId({ length: 10 });
        const roomId = uid.rnd();
        rooms[roomId] = []
        console.log(roomId,email, name, 'created  Room')
        socket.emit('room-created', {name, email,roomId});
    };

    const leaveRoom = (roomId, peerId)=>{
      rooms[roomId] = rooms[roomId]?.filter((peer)=>peer.peerId !== peerId );
      socket.to(roomId).emit("peer-left", {roomId,peerId})
    }


    const joinRoom = ({name, email,roomId, peerId})=>{
        socket.join(roomId);
        let flag = false;
            rooms[roomId]?.forEach(p => {
                  if(p.peerId === peerId){
                    flag = true;
                  }
            });
            if(flag){
            }else{
                rooms[roomId]?.push({name, email, peerId})
                socket.emit('get-messages', chats[roomId])

                socket.join(roomId)
                socket.to(roomId).emit("peer-joined", {peerId})
                socket.emit('get-peers', { 
                    roomId, 
                    peers:rooms[roomId]
                });
            }
       
       
      socket.on('disconnect', ()=>{
        leaveRoom(roomId, peerId)
      })
    
    };


    const startSharing = ({peerId, roomId})=>{
     socket.to(roomId).emit('user-started-sharing', peerId)
    }

    const stopSharing = ({roomId})=>{
      socket.to(roomId).emit('user-stopped-sharing')
    }

    const addMessage = (roomId, messageData)=>{
     if(chats[roomId]){
       chats[roomId].push(messageData)
     }else{
      chats[roomId] =[messageData]
     }
        console.log(roomId, messageData)
        socket.to(roomId).emit('add-message', messageData)
    }



   
    socket.on("create-room", createRoom)
    socket.on("join-room", joinRoom )
    socket.on('start-sharing', startSharing)
    socket.on('stop-sharing', stopSharing)
    socket.on("send-message", addMessage )

}
  
module.exports = roomHandler;