/*
 *
 * This uses code from a THREE.js Multiplayer boilerplate made by Or Fleisher:
 * https://github.com/juniorxsound/THREE.Multiplayer
 * And a WEBRTC chat app made by Mikołaj Wargowski:
 * https://github.com/Miczeq22/simple-chat-app
 *
 * Aidan Nelson, April 2020
 *
 *
 */


var Datastore = require('nedb');
var db = new Datastore({filename: 'database.json',autoload: true});
// express will run our server
const express = require("express");
const app = express();
app.use(express.static("public"));

//handling the post request
var bodyParser = require('body-parser');
var urlEncoder = bodyParser.urlencoded({extended: true});
app.use(urlEncoder);

// HTTP will expose our server to the web
const http = require("http").createServer(app);

// decide on which port we will use
const port = process.env.PORT || 8082;

//Server
const server = app.listen(port);
console.log("Server is running on " + port);

/////SOCKET.IO///////
const io = require("socket.io")().listen(server);

// Network Traversal
// Could also use network traversal service here (Twilio, for example):
let iceServers = [
  { url: "stun:stun.l.google.com:19302" },
  { url: "stun:stun1.l.google.com:19302" },
  { url: "stun:stun2.l.google.com:19302" },
  { url: "stun:stun3.l.google.com:19302" },
  { url: "stun:stun4.l.google.com:19302" },
];

app.get("/success", function(req,res){
  // console.log(req.query.msg);
  // console.log(req.query.col);
  // console.log(req.query.bd);
  // collect data in a JSON format
 var data = {
     msg : req.query.msg,
     col : req.query.col,
     bd : req.query.bd    
 };

 console.log(data);

 db.insert(data, function(err,newDoc){
  db.find({},function(err,docs){
  //  res.send("Data Saved " + newDoc);
   res.send(docs);
  });
});

});
  // hit submit to start control & send data






// an object where we will store innformation about active clients
let clients = {};

function main() {
  setupSocketServer();

  setInterval(function() {
    // update all clients of positions
    io.sockets.emit("userPositions", clients);
  }, 10);
}

main();


function setupSocketServer() {
  // Set up each socket connection
  io.on("connection", (client) => {
    console.log(
      "User " +
        client.id +
        " connected, there are " +
        io.engine.clientsCount +
        " clients connected"
    );

    //Add a new client indexed by their socket id
    clients[client.id] = {
      position: [0, 0.5, 0],
      rotation: [0, 0, 0, 1], // stored as XYZW values of Quaternion
    };

    // Make sure to send the client their ID and a list of ICE servers for WebRTC network traversal
    client.emit(
      "introduction",
      client.id,
      io.engine.clientsCount,
      Object.keys(clients),
      iceServers
    );

    // also give the client all existing clients positions:
    client.emit("userPositions", clients);

    //Update everyone that the number of users has changed
    io.sockets.emit(
      "newUserConnected",
      io.engine.clientsCount,
      client.id,
      Object.keys(clients)
    );

    // whenever the client moves, update their movements in the clients object
    client.on("move", (data) => {
      if (clients[client.id]) {
        clients[client.id].position = data[0];
        clients[client.id].rotation = data[1];
      }
    });

    //send Color
    client.on('data',(message)=>{
      console.log("client message"+message);
      if (clients[client.id]) {

      }
    });

    //Handle the disconnection
    client.on("disconnect", () => {
      //Delete this client from the object
      delete clients[client.id];
      io.sockets.emit(
        "userDisconnected",
        io.engine.clientsCount,
        client.id,
        Object.keys(clients)
      );
      console.log(
        "User " +
          client.id +
          " diconnected, there are " +
          io.engine.clientsCount +
          " clients connected"
      );
    });

    // from simple chat app:
    // WEBRTC Communications
    client.on("call-user", (data) => {
      console.log(
        "Server forwarding call from " + client.id + " to " + data.to
      );
      client.to(data.to).emit("call-made", {
        offer: data.offer,
        socket: client.id,
      });
    });

    client.on("make-answer", (data) => {
      client.to(data.to).emit("answer-made", {
        socket: client.id,
        answer: data.answer,
      });
    });

    // ICE Setup
    client.on("addIceCandidate", (data) => {
      client.to(data.to).emit("iceCandidateFound", {
        socket: client.id,
        candidate: data.candidate,
      });
    });

    client.on('request',function(data){
      let message = {
        id: socket.id,
        data : data
      }
      console.log("from socket" + message);
    });
  });
}
