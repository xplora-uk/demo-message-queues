const express = require('express');
const dotenv = require('dotenv');
const { makeQueueConnection } = require('./queue');
const { makeMessageHandlers } = require('./messageHandlers');

dotenv.config();
main();

async function main() {

  const app = express();

  app.use(express.json()); // body parser

  const queueConn = await makeQueueConnection({ queueUrl: process.env.QUEUE_URL });

  const msgHandlers = await makeMessageHandlers({ QUEUE_1_TARGET_URL: process.env.QUEUE_1_TARGET_URL });

  for(let msgHandler of msgHandlers) {
    queueConn.setupChannel(msgHandler.queue, msgHandler.handler);
  }

  app.get('/health', (req, res) => {
    res.json({ status: 'OK', ts: new Date() });
  });

  app.listen(process.env.PORT, () => {
    console.log(`subscriber proxy is listening on port ${process.env.PORT}`);
  });
}
