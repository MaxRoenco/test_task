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
      getMessages(msg.ticketId, ws);
    } else if (msg.type === "message") {
      const clients = channels.get(msg.ticketId);
      if (clients) {
        const timeStamp = new Date().toISOString();
        msg.timestamp = timeStamp;
        msg.id = Math.floor(Math.random() * 1000000000);
        clients.forEach(o => {
          o.client.send(JSON.stringify(msg));
        })
        pushMessage(msg)
      }

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


async function pushMessage(msg) {
  try {
    const id = Number(msg.ticketId);
    const payload = {
      data: {
        text: msg.text,
        bug_report: id,
        timestamp: msg.timestamp,
        userId: msg.userId,
        userName: msg.userName,
      },
    };
    const response = await fetch("http://localhost:1337/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
  } catch (error) {
    console.error(error.message);
  }
}

async function getMessages(id, client) {
  try {
    const url = `http://localhost:1337/api/bug-reports/?filters[id][$eq]=${id}&populate=messages`;
    console.log(url)
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    const res = json.data[0]
    res.type = "messages";
    console.log()
    client.send(JSON.stringify(res));

  } catch (error) {
    console.error(error.message);
  }
}