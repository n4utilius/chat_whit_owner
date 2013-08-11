var io = require('socket.io').listen(8085);

var operator = { "socket" : null, "sockets" : {} };

io.sockets.on('connection', function (socket) {
  socket.on("operator", function(key,fn){
    // operator has connected
    // authenticate operator 
    operator.socket = socket;
    console.log("Operator connected")
    fn("success");
  });

  socket.on("client", function(name, fn){
    //client has connected
    //add this socket to our operator's sockets 
    sockets = operator.sockets
    sockets[socket.id + ""] = socket;
    ////operator.sockets.push(socket);
    console.log(name + " client connected")
    fn("success");
  });

  socket.on('message', function(msg, fn){
    //am I the  operator or client
    //operator code 
    /**
    msg is object with keys: {to_client, text} for operator
    **/
    if(operator.socket.id == socket.id){
      sockets = operator.sockets
      s = sockets[msg.to_client] 
      s.emit("message",msg.text);  //send message to client
    }else{
      //client code, send ms  g to operator
      operator.socket.emit("message",socket.id, msg);
    }
    //callback
    console.log("--- Message Sendend ---")
    fn(msg); 
  });
/*
  socket.on('disconnect', function () {
    if(socket.id != operator.id){
      console.log("REMOVE SOCKET FROM OPERATOR ARRAY");
    }
  });
*/
});