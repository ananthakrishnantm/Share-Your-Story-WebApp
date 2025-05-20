const SocketServer = (io) => {
  const apiNamespace = io.of("/api");

  apiNamespace.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Handle follow event
    socket.on("follow", (userToFollowId) => {
      console.log(`Received follow event for user: ${userToFollowId}`);
      // Perform necessary actions (e.g., update database)
      // Emit event to notify the specific user about the follow action
      apiNamespace.to(userToFollowId).emit("followUpdate", socket.id); // Assuming userToFollowId is the socket id or user identifier
    });

    // Handle unfollow event
    socket.on("unfollow", (userToUnFollowId) => {
      console.log(`Received unfollow event for user: ${userToUnFollowId}`);
      // Perform necessary actions (e.g., update database)
      // Emit event to notify the specific user about the unfollow action
      apiNamespace.to(userToUnFollowId).emit("unfollowUpdate", socket.id); // Assuming userToUnFollowId is the socket id or user identifier
    });

    // Handle disconnect event
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

export default SocketServer;
