import { WebSocket, WebSocketServer } from 'ws';

import ServerAgent from './ServerAgent';

const webSocketServer = new WebSocketServer({ port: 8080 });

const agents: {
  [id: string]: ServerAgent;
} = {};

webSocketServer.on('connection', (socket) => {
  console.log('Connected to web socket server');

  socket.on('error', console.error);

  socket.on('message', async function message(stream) {
    const message = JSON.parse(stream.toString());

    switch (message.type) {
      case 'createAgent': {
        onCreateAgent(socket, message);
        break;
      }

      case 'requestActivity': {
        onRequestActivity(socket, message);
        break;
      }

      case 'requestMessage': {
        onRequestMessage(socket, message);
        break;
      }

      default: {
        console.error(`Error: Unable to process message with data: ${stream}`);
      }
    }
  });
});

async function onCreateAgent(socket: WebSocket, data: any) {
  console.log(`Creating Agent: ${data.agentId}`);

  const newAgentId = data.agentId;

  if (agents[newAgentId]) {
    socket.send(
      JSON.stringify({
        type: 'agentCreated',
        success: false,
        message: `Agent with id ${newAgentId} already exists`,
      }),
    );

    return;
  }

  agents[newAgentId] = new ServerAgent(newAgentId);

  socket.send(
    JSON.stringify({
      type: 'agentCreated',
      success: true,
      agentId: newAgentId,
      message: `Agent with id ${newAgentId} created`,
    }),
  );

  console.log(`Agent with id: ${data.agentId} created.`);
}

async function onRequestActivity(socket: WebSocket, data: any) {
  const agentId = data.agentId;

  console.log(`requestActivity message for agent: ${agentId}`);

  if (agents[agentId]) {
    const completion = await agents[agentId].processMessage(data);

    socket.send(JSON.stringify({ type: 'nextActivity', agentId: agentId, data: completion }));
  } else {
    socket.send(JSON.stringify({ type: 'error', message: `Agent with id ${agentId} not found` }));
  }
}

async function onRequestMessage(socket: WebSocket, data: any) {
  // TODO
}
