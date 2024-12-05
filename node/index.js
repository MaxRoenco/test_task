const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

const channels = new Map();

wss.on('connection', (ws) => {

  ws.on('message', (message) => {
    const msg = JSON.parse(message.toString());
    console.log("MESSAGE:", msg);
    if (msg.type === "init") {
      msg.user["client"] = ws;
      if (channels.has(msg.ticketId)) {
        channels.get(msg.ticketId).push(msg.user);
      } else {
        channels.set(msg.ticketId, [msg.user]);
      }
      ws.user = msg.user;
      //TODO: send old messages to the new connecting client
    } else if (msg.type === "message") {
      const clients = channels.get(msg.ticketId);
      clients.forEach(o => {
        msg.variant = o.client === ws || o.client.user.id === msg.user.id ? "sent" : "received";
        o.client.send(JSON.stringify(msg));
      })
    } else if (msg.type === "close") {
      let clients = channels.get(msg.ticketId).filter(o => o.client !== ws);
      if (clients.length > 0) {
        channels.set(msg.ticketId, clients);
      } else {
        channels.delete(msg.ticketId);
      }
    }
  });

  ws.on('close', () => {
    console.log(`client disconnected`);
  });
});

console.log('WebSocket server is running on ws://localhost:3001');
