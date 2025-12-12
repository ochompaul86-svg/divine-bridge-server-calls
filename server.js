const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

// Root route to confirm service is up
app.get("/", (req, res) => {
  res.send("DivineBridge signaling server is running");
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-room", ({ room }) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on("offer", (payload) => {
    socket.to(payload.room).emit("offer", payload);
  });

  socket.on("answer", (payload) => {
    socket.to(payload.room).emit("answer", payload);
  });

  socket.on("ice-candidate", (payload) => {
    socket.to(payload.room).emit("ice-candidate", payload);
  });

  socket.on("end-call", (payload) => {
    socket.to(payload.room).emit("end-call", payload);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`);
});
