const express=require("express");
const http=require("http");
const path=require("path");
const {Server}=require("socket.io");

const app=express();
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:true,methods:["GET","POST"]}});
app.use(express.static(path.join(__dirname,"public")));

const rooms=new Map();

app.get("/health",(req,res)=>res.json({
  ok:true,
  players:io.engine.clientsCount,
  rooms:rooms.size
}));

function clean(s){
  return String(s||"").replace(/[^\w\u0600-\u06FF -]/g,"").slice(0,16)||"Player";
}
function roomCode(s){
  return String(s||"LOBBY").replace(/[^a-zA-Z0-9_-]/g,"").slice(0,16).toUpperCase()||"LOBBY";
}

io.on("connection",socket=>{
  socket.on("joinRoom",data=>{
    const room=roomCode(data?.room);
    const old=socket.data.room;
    if(old && rooms.has(old)){
      rooms.get(old).delete(socket.id);
      socket.to(old).emit("playerLeft",socket.id);
    }

    socket.join(room);
    socket.data.room=room;
    socket.data.name=clean(data?.name);

    if(!rooms.has(room)) rooms.set(room,new Map());
    const r=rooms.get(room);
    const player={
      id:socket.id,
      name:socket.data.name,
      x:Number(data?.x)||0,
      z:Number(data?.z)||10,
      pet:Number(data?.pet)||0
    };
    r.set(socket.id,player);

    socket.emit("roomState",{room,players:[...r.values()]});
    socket.to(room).emit("playerJoined",player);
  });

  socket.on("move",p=>{
    const r=rooms.get(socket.data.room);
    const me=r?.get(socket.id);
    if(!me)return;
    if(Number.isFinite(p?.x)&&Number.isFinite(p?.z)){
      me.x=Math.max(-110,Math.min(110,p.x));
      me.z=Math.max(-100,Math.min(100,p.z));
      socket.to(socket.data.room).emit("playerMoved",{
        id:socket.id,x:me.x,z:me.z
      });
    }
  });

  socket.on("disconnect",()=>{
    const room=socket.data.room;
    const r=rooms.get(room);
    if(r){
      r.delete(socket.id);
      socket.to(room).emit("playerLeft",socket.id);
      if(!r.size) rooms.delete(room);
    }
  });
});

const port=process.env.PORT||3000;
server.listen(port,"0.0.0.0",()=>console.log(`Game server listening on ${port}`));
