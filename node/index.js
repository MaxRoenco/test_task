const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });

const channels = new Map();

wss.on('connection', (ws) => {

  ws.on('message', (message) => {
    const msg = JSON.parse(message.toString());
    console.log("MESSAGE:", msg);
    if (msg.type === "init") {
      msg.user["client"] = ws;
      if (channels.has(msg.documentId)) {
        channels.get(msg.documentId).push(msg.user);
      } else {
        channels.set(msg.documentId, [msg.user]);
      }
      ws.user = msg.user;
      getData("http://localhost:1337/api/bug-reports", msg.documentId, ws);


    } else if (msg.type === "message") {
      const clients = channels.get(msg.documentId);
      if (clients) {
        const timeStamp = new Date().toISOString();
        msg.timestamp = timeStamp;
        msg.id = Math.floor(Math.random() * 1000000000);
        clients.forEach(o => {
          o.client.send(JSON.stringify(msg));
        })
        // console.log(msg);
        pushData("http://localhost:1337/api/messages", msg, parseInt(msg.ticketId))
        // pushData("http://localhost:1337/api/messages", );
        //TODO: append this to the messages in the server
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


async function pushData(url, message, id) {
  try {
    const payload = {
      data: {
        text: message.text,
        bug_report: id,
        timestamp: message.timestamp,
        userId: message.userId,
        userName: message.userName,
      },
    };
    const response = await fetch(url, {
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

async function getData(url, id, client) {
  try {
    const newUrl = `${url}/${id}?populate=*`;
    const response = await fetch(`${url}/${id}?populate=*`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    json.data.type = "messages";
    client.send(JSON.stringify(json.data));

  } catch (error) {
    console.error(error.message);
  }
}