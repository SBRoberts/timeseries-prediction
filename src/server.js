var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(5000);

const environment =  process.env.NODE_ENV

app.get("/", function(req, res) {
  res.send('working');
});

io.on("connection", function(socket) {
  socket.emit("default", { hello: "world" });
});
