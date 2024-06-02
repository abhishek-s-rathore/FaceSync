const express = require("express");
const http =  require("http");
const cors = require("cors");
const {Server}= require("socket.io");
const roomHandler  = require("./room");

const PORT = 8000;
const app = express();
app.use(cors);
const server = http.createServer(app);
const io = new Server(
                       server,
                       {
                        cors:{
                                 origin: "*",
                                 method: ["GET", "POST", "PATCH", "PUT", "DELETE"]
                             }
                        }
                       );

io.on('connection', (socket)=>{
console.log('Socket connected');
  
 roomHandler(socket);

socket.on('disconnect', ()=>{
    console.log('Socket Disconnected');
})
});

server.listen(PORT, ()=>{
    console.log(`Server Listening to port: ${PORT}`)
});