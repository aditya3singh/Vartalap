const { Server } = require('socket.io');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  const io = new Server({
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('join-room', (roomId, userId) => {
      socket.join(roomId);
      socket.broadcast.to(roomId).emit('user-connected', userId);

      socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('user-leave', userId);
      });

      socket.on('user-toggle-audio', (userId) => {
        socket.broadcast.to(roomId).emit('user-toggle-audio', userId);
      });

      socket.on('user-toggle-video', (userId) => {
        socket.broadcast.to(roomId).emit('user-toggle-video', userId);
      });
    });
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Socket server initialized' })
  };
};
