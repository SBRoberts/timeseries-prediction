const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const ngrok = require("ngrok");

server.listen(5000);

const environment = process.env.NODE_ENV;

app.use(express.json());

app.get("/", function(req, res) {
  res.send("working");
});

app.post("/forecast", (req, res) => {
  console.log("req", req.body);
  io.emit("forecast", req.body);
});

let url = "";
io.on("connection", async socket => {
  try {
    url = await ngrok.connect(5000);
  } catch (error) {
    console.log(error);
  }
  socket.emit("connection", { hello: "world", url });

  socket.on("disconnect", async reason => {
    console.log("Disconnect reason:", reason);

    await ngrok.kill();
  });
});

io.on("disconnect", socket => {
  console.log("DISCONNECTED");
});
