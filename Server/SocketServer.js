const SocketServer = (socket, io) => {
  console.log("Client connected:", socket.id);

  // Handle follow event
  socket.on("follow", (userToFollowId) => {
    console.log(`Received follow event for user: ${userToFollowId}`);
    // Perform necessary actions (e.g., update database)
    // Emit event to notify clients about the follow action
    io.emit("followUpdate", userToFollowId);
  });

  // Handle unfollow event
  socket.on("unfollow", (userToUnFollowId) => {
    console.log(`Received unfollow event for user: ${userToUnFollowId}`);
    // Perform necessary actions (e.g., update database)
    // Emit event to notify clients about the unfollow action
    io.emit("unfollowUpdate", userToUnFollowId);
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
};

export default SocketServer;
