var app = require("express")();
var server = require("http").Server(app);
var io = require("socket.io")(server);

server.listen(5000);
// WARNING: app.listen(80) will NOT work here!

app.get("/", function(req, res) {
  res.send('working');
});

io.on("connection", function(socket) {
  socket.emit("default", { hello: "world" });
});
